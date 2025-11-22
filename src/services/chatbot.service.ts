import { config } from '../config/env';
import { logger } from '../config/logger';
import fs from 'fs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ChatbotService {
  private apiKey: string;
  private systemContext: string;

  constructor() {
    this.apiKey = config.geminiApiKey;
    this.systemContext = this.buildSystemContext();
  }

  private buildSystemContext(): string {
    return `You are Agila, an AI assistant for Agila Bus Transport Corporation's Inventory Management System (IMS).

SYSTEM OVERVIEW:
The IMS is a comprehensive system for managing bus transport operations including inventory, supplies, orders, requests (purchase and item request) and bus management.

YOUR ROLE:
- Answer questions about the IMS features and capabilities
- Help users understand how to use the system
- Provide information about inventory management, bus management, suppliers, orders, and stock management
- Be concise, friendly, and professional

MAIN FEATURES YOU CAN HELP WITH:

1. DASHBOARD
   - Displays KPIs and overview data
   - Shows real-time status of items, approvals, buses, and requests
   - Shows fuel consumption and fuel consumption prediction

2. STOCK MANAGEMENT
    - Monitor current stock levels
    - Records all incomming and outgoing stock movements
    - Tracks stocks that has expiration dates
    - Tracks current status of stocks (available, out of stock, low stock, under maintenance, expired, in use)

3. BUS MANAGEMENT
   - Manages bus information details
   - Shows the status of buses (active, decommissioned, under maintenance)

4. ITEM MANAGEMENT
   - Track all inventory items 
   - Manage item categories and units
   - View item specifications and details

5. SUPPLIER MANAGEMENT
   - Manage supplier information and contacts
   - Track supplier items and pricing
   - View supplier performance 

6. REQUEST MANAGEMENT (Purchase Request)
   - Submit purchase requests
   - Track request approval workflow
   - View request status and history

7. REQUEST MANAGEMENT (Item Request)
    - Submit item requests
    - Track item request approval workflow
    - View item request status and history

8. BUDGET REQUEST MANAGEMENT
    - Track budget requests
    - View budget request status and history

9. ORDER MANAGEMENT (Purchase Orders)
   - Create and track purchase orders
   - Manage order items and quantities
   - Monitor order status and delivery
   - Track order history
   - Sends defects and missing items to finance management system (FMS)

8. DISPOSAL MANAGEMENT
   - Manage disposal of buses and stock
   - Track disposal methods and reasons
   - Record disposal documentation

9. ANALYTICS AND REPORTING
   - Generate reports and analytics
   - View forecasting and trends
   - Export data to PDF

IMPORTANT RULES:
- ONLY answer questions about the IMS system and its features
- If asked about topics outside the IMS (politics, personal advice, general knowledge, etc.), politely decline and say: "I'm designed specifically to assist with the Agila IMS. I can only answer questions about inventory management, bus operations, and system features. Please ask me about IMS-related topics!"
- Keep responses SHORT and to the point (2-4 sentences maximum)
- Be helpful and guide users to the right module/feature
- Use simple, clear language
- Avoid technical jargon unless necessary

RESPONSE STYLE:
- Friendly but professional
- Concise and direct
- Action-oriented (tell them what they can do)
- Always relate answers back to IMS features`;
  }

  private async transcribeAudio(audioFilePath: string): Promise<string> {
    try {
      const audioBuffer = fs.readFileSync(audioFilePath);
      const base64Audio = audioBuffer.toString('base64');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: 'Transcribe this audio message accurately:' },
                {
                  inline_data: {
                    mime_type: 'audio/webm',
                    data: base64Audio
                  }
                }
              ]
            }]
          })
        }
      );

      if (!response.ok) throw new Error('Audio transcription failed');
      
      const data = await response.json() as any;
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      logger.error('Audio transcription error:', error);
      return '';
    }
  }

  async generateResponse(message: string, history: ChatMessage[] = [], audioFile?: Express.Multer.File): Promise<string> {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        return "I'm currently unavailable. Please contact your system administrator for assistance.";
      }

      let finalMessage = message;

      // Process audio if provided
      if (audioFile) {
        const transcription = await this.transcribeAudio(audioFile.path);
        if (transcription) {
          finalMessage = transcription;
          logger.info('Audio transcribed', { transcription: transcription.substring(0, 100) });
        } else {
          return "I couldn't hear your voice message clearly. Please try speaking again or type your question instead.";
        }
      }

      // Build conversation context
      let prompt = `${this.systemContext}\n\n`;

      // Add conversation history (last 5 messages for context)
      if (history.length > 0) {
        prompt += 'CONVERSATION HISTORY:\n';
        history.slice(-5).forEach(msg => {
          prompt += `${msg.role === 'user' ? 'User' : 'Agila'}: ${msg.content}\n`;
        });
        prompt += '\n';
      }

      // Add current user message
      prompt += `User: ${finalMessage}\nAgila:`;

      // Call Google Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
              topP: 0.8,
              topK: 10
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('Gemini API error:', errorData);
        
        if (response.status === 400) {
          return "I'm having trouble understanding your request. Could you please rephrase your question?";
        } else if (response.status === 403 || response.status === 401) {
          return "I'm currently unavailable. Please contact your system administrator for assistance.";
        }
        
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json() as any;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        logger.error('Unexpected API response structure:', data);
        return "I'm having trouble responding right now. Please try asking your question again.";
      }

      logger.info('Chatbot response generated', { 
        messageLength: message.length,
        responseLength: text.length 
      });

      return text.trim();
    } catch (error) {
      logger.error('Error generating chatbot response:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('authentication')) {
          return "I'm currently unavailable. Please contact your system administrator for assistance.";
        }
        if (error.message.includes('network') || error.message.includes('fetch')) {
          return "I'm having trouble connecting. Please check your internet connection and try again.";
        }
      }
      
      return "I'm having some difficulties right now. Please try again in a moment, or contact support if the issue persists.";
    }
  }

  async getGreeting(): Promise<string> {
    return "Welcome to Agila Bus Transport Chat Support!\n\nHow can I assist you today? You can ask about schedules, bookings, routes, or any IMS features.";
  }
}

export const chatbotService = new ChatbotService();