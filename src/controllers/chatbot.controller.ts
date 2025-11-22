import { Request, Response, NextFunction } from 'express';
import { chatbotService } from '../services/chatbot.service';
import { logger } from '../config/logger';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(__dirname, '../../uploads/chat');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export const uploadMiddleware = upload.single('audio');

// Validation schema
const chatMessageSchema = z.object({
  message: z.string().min(0).max(1000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
});

export class ChatbotController {
  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Parse history if it's a string
      if (typeof req.body.history === 'string') {
        try {
          req.body.history = JSON.parse(req.body.history);
        } catch {
          req.body.history = [];
        }
      }

      // Validate request body
      const validation = chatMessageSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: validation.error.errors,
        });
        return;
      }

      const { message, history } = validation.data;
      const audioFile = req.file;

      // Generate response with optional audio
      const response = await chatbotService.generateResponse(message, history, audioFile);

      // Clean up uploaded audio file
      if (audioFile) {
        fs.unlink(audioFile.path, () => {});
      }

      logger.info('Chat message processed', { 
        userId: (req as any).user?.id || 'anonymous',
        messagePreview: message.substring(0, 50) 
      });

      res.json({
        success: true,
        data: {
          response,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error('Error in chatbot controller:', error);
      next(error);
    }
  }

  async getGreeting(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const greeting = await chatbotService.getGreeting();

      res.json({
        success: true,
        data: {
          response: greeting,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error('Error getting greeting:', error);
      next(error);
    }
  }
}

export const chatbotController = new ChatbotController();