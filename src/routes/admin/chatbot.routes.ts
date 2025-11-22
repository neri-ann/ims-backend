
import { Router } from 'express';
import { chatbotController, uploadMiddleware } from '../../controllers/chatbot.controller';
import { authenticate } from '../../middleware/auth';
import { rateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Routes - all protected by auth middleware
// Note: If ENABLE_JWT_AUTH is false, auth middleware will pass through

// POST /api/v1/admin/chatbot - Send a chat message (with optional audio/file)
router.post('/', 
  authenticate, 
  rateLimiter,
  uploadMiddleware,
  (req, res, next) => chatbotController.chat(req, res, next)
);

// GET /api/v1/admin/chatbot/greeting - Get initial greeting
router.get('/greeting', 
  authenticate, 
  (req, res, next) => chatbotController.getGreeting(req, res, next)
);

export default router;
