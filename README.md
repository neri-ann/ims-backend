# Inventory Management System - Backend API

A comprehensive inventory management system built with Express.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Item Management** - Track items, categories, and units of measure
- **Supplier Management** - Manage suppliers and supplier items
- **Stock Management** - Real-time inventory tracking with batch management
- **Bus Management** - Fleet management for transportation vehicles
- **Order Management** - Purchase orders with status tracking
- **Disposal Management** - Asset disposal workflow
- **JWT Authentication** - Secure token-based authentication (can be toggled on/off)
- **Role-Based Access Control** - Admin and staff permission levels
- **Audit Trail** - Complete history of all operations
- **Redis Caching** - High-performance caching layer
- **Microservice Ready** - Built for microservice architecture

## 📋 Prerequisites

- Node.js >= 20.0.0
- PostgreSQL >= 14
- Redis (optional, for caching)
- npm or pnpm

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `INVENTORY_DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Your JWT secret key
   - `ENABLE_JWT_AUTH` - Set to `true` to enable JWT authentication
   - Other configuration as needed

4. **Setup database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database with initial data
   npm run prisma:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`

## 🔐 JWT Authentication

### Toggle JWT Authentication

JWT authentication can be **enabled or disabled** via the `.env` file:

```env
ENABLE_JWT_AUTH=true   # Enable JWT (production)
ENABLE_JWT_AUTH=false  # Disable JWT (development only)
```

When **enabled**:
- All protected routes require a valid JWT token
- Include token in `Authorization: Bearer <token>` header
- JWT secret: `8f7b3a2c9d4e6f8a0b1c2d3e4f5g6h7i` (default, change in production)

When **disabled**:
- Authentication is bypassed (development mode only)
- All routes are accessible without tokens
- **⚠️ NEVER use in production!**

### JWT Payload Structure

```typescript
{
  sub: string;        // User ID
  username: string;   // Username
  role: string;       // User role (admin, staff, inventory_manager)
  iat: number;        // Issued at
  exp: number;        // Expires at
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── env.ts        # Environment variables
│   │   ├── logger.ts     # Winston logger
│   │   ├── database.ts   # Prisma client
│   │   └── redis.ts      # Redis client
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # JWT authentication
│   │   ├── authorize.ts  # Role-based authorization
│   │   ├── errorHandler.ts
│   │   └── serviceApiKey.middleware.ts
│   │
│   ├── services/         # Business logic layer
│   │   ├── item.service.ts
│   │   ├── supplier.service.ts
│   │   ├── stock.service.ts
│   │   ├── bus.service.ts
│   │   ├── order.service.ts
│   │   └── disposal.service.ts
│   │
│   ├── controllers/      # Request handlers
│   │   └── item.controller.ts
│   │
│   ├── routes/           # API routes
│   │   ├── admin/        # Admin routes
│   │   └── staff/        # Staff routes
│   │
│   ├── utils/            # Utility functions
│   │   └── errors.ts     # Custom error classes
│   │
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server startup
│
├── lib/                  # Shared libraries
│   └── shared/
│       ├── errorHandler.ts
│       └── responseFormatter.ts
│
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed_enums.ts     # Enum seeding
│   └── seed_core_data.ts # Core data seeding
│
├── .env.example          # Environment template
├── package.json
└── tsconfig.json
```

## 🛣️ API Endpoints

### Health Check
```
GET /health              # Server health status
GET /                    # API information
```

### Items (Admin)
```
GET    /api/v1/admin/items           # List items
POST   /api/v1/admin/items           # Create item
GET    /api/v1/admin/items/:id       # Get item
PUT    /api/v1/admin/items/:id       # Update item
DELETE /api/v1/admin/items/:id       # Delete item
```

### More endpoints...
(Add more routes as you implement them)

## 🗄️ Database Schema

Key models:
- **Category** - Item categories
- **UnitMeasure** - Units of measurement
- **Item** - Inventory items
- **Supplier** - Supplier information
- **SupplierItem** - Supplier-item relationships
- **Stock** - Current stock levels
- **Batch** - Stock batches with expiration tracking
- **Bus** - Fleet vehicles
- **Order** - Purchase orders
- **Disposal** - Asset disposals
- **Attachment** - File attachments

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **JWT Authentication** - Token-based auth (toggleable)
- **Role-Based Access Control** - Permission management
- **API Key Authentication** - For microservice communication
- **Input Validation** - Request validation
- **Audit Trail** - Complete operation history

## 📝 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database
```

## 🧪 Testing

```bash
# Run tests (TODO: Add test framework)
npm test
```

## 🌐 Microservice Integration

This service integrates with:
- **Finance Service** - Financial transaction management
- **HR Service** - Employee and authentication data
- **Audit Logs Service** - Centralized audit logging

## 🐛 Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "details": {}
}
```

## 📊 Logging

Logs are written to:
- Console (with colors in development)
- File (`./logs/inventory.log`)

Log levels: `error`, `warn`, `info`, `debug`

## 🚢 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variables for production

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Start the server:
   ```bash
   npm start
   ```

## 📄 License

Private - Capstone Project

## 👥 Contributors

Capstone Team - 2025

---

**Need help?** Check the logs or contact the development team.
