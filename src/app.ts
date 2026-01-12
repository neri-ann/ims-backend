import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/env';
import { morganStream } from './config/logger';
import { errorHandler } from './middleware/errorHandler';

// Routes
import adminItemRoutes from './routes/admin/item.routes';
import adminSupplierRoutes from './routes/admin/supplier.routes';
import adminSupplierItemRoutes from './routes/admin/supplier-item.routes';
import adminCategoryRoutes from './routes/admin/category.routes';
import adminUnitRoutes from './routes/admin/unit.routes';
import adminChatbotRoutes from './routes/admin/chatbot.routes';
import adminStockRoutes from './routes/admin/stock.routes';
import adminBatchRoutes from './routes/admin/batch.routes';
import adminBusRoutes from './routes/admin/bus.routes';
import adminBusOperationRoutes from './routes/admin/bus-operation.routes';
import adminDisposalRoutes from './routes/admin/disposal.routes';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS - Allow all origins for cross-domain access
  app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression
  app.use(compression());

  // HTTP request logging
  app.use(morgan('combined', {
    stream: morganStream,
  }));

  // Basic rate limiting
  import('./middleware/rateLimiter').then(m => {
    app.use(m.rateLimiter);
  }).catch(() => {});

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      jwtAuth: config.enableJwtAuth ? 'enabled' : 'disabled',
    });
  });

  // API info endpoint
  app.get('/', (_req, res) => {
    res.json({
      name: 'Inventory Management System API',
      version: '1.0.0',
      description: 'Inventory Management System - Pure Backend',
      endpoints: {
        health: '/health',
        api: '/api/v1',
      },
      authentication: {
        jwt: config.enableJwtAuth ? 'enabled' : 'disabled',
        note: config.enableJwtAuth 
          ? 'JWT authentication is enabled. Include Bearer token in Authorization header.' 
          : 'JWT authentication is disabled (development mode).',
      },
    });
  });

  // ===========================
  // API Routes
  // ===========================
  
  // Admin routes (Full CRUD + additional actions)
  app.use('/api/v1/admin/items', adminItemRoutes);
  app.use('/api/v1/admin/suppliers', adminSupplierRoutes);
  app.use('/api/v1/admin/supplier-items', adminSupplierItemRoutes);
  app.use('/api/v1/admin/categories', adminCategoryRoutes);
  app.use('/api/v1/admin/units', adminUnitRoutes);
  app.use('/api/v1/admin/chatbot', adminChatbotRoutes);
  // Stock routes
  app.use('/api/v1/admin/stocks', adminStockRoutes);
  // Batch routes
  app.use('/api/v1/admin/batches', adminBatchRoutes);
  // TODO: Add more admin routes here:
  app.use('/api/v1/admin/buses', adminBusRoutes);
  app.use('/api/v1/admin/bus-operation', adminBusOperationRoutes);
  app.use('/api/v1/admin/disposals', adminDisposalRoutes);
  // app.use('/api/v1/admin/orders', adminOrderRoutes);
  
  // Staff routes (Limited access - read + create for some modules)
  // TODO: Add staff routes as needed
  
  // Integration routes (for microservice-to-microservice communication)
  // TODO: Add integration routes as needed

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};