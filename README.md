# IMS Backend API

A clean, scalable, and secure backend application built with Node.js, Express (TypeScript), and Prisma with PostgreSQL. This project follows best practices for modularity, maintainability, and domain-driven design.

## 🏗️ Architecture Overview

This backend is designed with a modular, layered architecture that promotes:
- **Separation of Concerns**: Each layer has a specific responsibility
- **Scalability**: Easy to add new modules and features
- **Maintainability**: Clear structure makes code easy to understand and modify
- **Security**: Built-in authentication, validation, and error handling
- **Testability**: Modular design facilitates unit and integration testing

## 📁 Project Structure

```
ims-backend/
├── prisma/
│   └── schema.prisma              # Prisma database schema
├── src/
│   ├── config/
│   │   └── index.ts               # Environment configuration (centralized settings)
│   ├── constants/
│   │   └── index.ts               # Application constants (HTTP codes, messages, enums)
│   ├── controllers/
│   │   └── auth.controller.ts     # Request handlers (handle HTTP requests/responses)
│   ├── database/
│   │   └── index.ts               # Prisma client singleton (DB connection management)
│   ├── logger/
│   │   └── index.ts               # Winston logger configuration (logging system)
│   ├── middlewares/
│   │   ├── auth.ts                # Authentication & authorization middleware
│   │   ├── errorHandler.ts       # Global error handling
│   │   └── validate.ts            # Request validation middleware
│   ├── modules/
│   │   ├── auth/                  # Auth domain module (can contain services, types, etc.)
│   │   └── users/                 # Users domain module
│   ├── routes/
│   │   ├── v1/                    # API v1 routes (versioning support)
│   │   │   ├── auth.routes.ts
│   │   │   └── index.ts
│   │   └── index.ts               # Main routes entry point
│   ├── services/
│   │   └── auth.service.ts        # Business logic layer (auth operations)
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   ├── index.ts               # General utility functions
│   │   ├── jwt.ts                 # JWT token utilities
│   │   ├── password.ts            # Password hashing utilities
│   │   └── response.ts            # API response utilities
│   ├── validators/
│   │   └── auth.validator.ts      # Request validation schemas
│   ├── app.ts                     # Express app configuration
│   └── server.ts                  # Server entry point
├── .env.example                   # Environment variables template
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore rules
├── .prettierrc.json               # Prettier configuration
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file

```

## 📦 Folder Purposes

### `/src/config`
**Purpose**: Centralized configuration management
- Loads environment variables
- Provides typed configuration objects
- Makes config accessible throughout the app
- **Why**: Single source of truth for all settings

### `/src/constants`
**Purpose**: Application-wide constants
- HTTP status codes
- Error/success messages
- Enums (UserRole, TokenType)
- **Why**: Consistency, type safety, easy to maintain

### `/src/controllers`
**Purpose**: Handle HTTP requests and responses
- Parse request data
- Call service layer
- Return formatted responses
- **Why**: Thin layer focused on HTTP concerns, keeps business logic separate

### `/src/database`
**Purpose**: Database connection and Prisma client
- Singleton pattern for Prisma client
- Connection management
- Health checks
- **Why**: Centralized DB access, prevents multiple connections

### `/src/logger`
**Purpose**: Application logging
- Winston-based logging
- Daily log rotation
- Different log levels (info, error, debug)
- **Why**: Debugging, monitoring, audit trails

### `/src/middlewares`
**Purpose**: Express middleware functions
- Authentication (JWT verification)
- Authorization (role-based access)
- Error handling
- Request validation
- **Why**: Reusable, composable request processing

### `/src/modules`
**Purpose**: Domain-driven design modules
- Each module represents a business domain
- Can contain domain-specific services, types, etc.
- **Why**: Encapsulation, easy to add/remove features

### `/src/routes`
**Purpose**: API route definitions
- RESTful endpoint definitions
- Route versioning (v1, v2)
- Middleware composition
- **Why**: Clear API structure, supports versioning

### `/src/services`
**Purpose**: Business logic layer
- Core business operations
- Database interactions
- Complex computations
- **Why**: Separation of concerns, reusable business logic

### `/src/types`
**Purpose**: TypeScript type definitions
- Request/response types
- Entity interfaces
- Custom types
- **Why**: Type safety, better IDE support, documentation

### `/src/utils`
**Purpose**: Utility functions
- Helper functions
- Common operations
- Reusable code
- **Why**: DRY principle, code reuse

### `/src/validators`
**Purpose**: Request validation schemas
- Express-validator schemas
- Input validation rules
- **Why**: Data integrity, security, clear validation logic

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ims-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: express-validator for request validation
- **Error Handling**: Centralized error handling
- **Rate Limiting**: (Ready to implement)

## 🔑 Authentication Flow

1. **Register**: `POST /api/v1/auth/register`
   - Validates input
   - Hashes password
   - Creates user
   - Returns JWT tokens

2. **Login**: `POST /api/v1/auth/login`
   - Validates credentials
   - Verifies password
   - Returns JWT tokens

3. **Refresh Token**: `POST /api/v1/auth/refresh`
   - Validates refresh token
   - Returns new access token

4. **Get Profile**: `GET /api/v1/auth/me`
   - Requires authentication
   - Returns user profile

5. **Logout**: `POST /api/v1/auth/logout`
   - Invalidates session (extend as needed)

## 📊 API Versioning

The API uses URL-based versioning:
- Current version: `v1`
- Base URL: `/api/v1`
- Example: `http://localhost:3000/api/v1/auth/login`

To add a new API version:
1. Create `/src/routes/v2/` directory
2. Implement new routes
3. Register in `/src/routes/index.ts`

## 🗄️ Database Schema

The Prisma schema defines a `User` model with:
- UUID primary key
- Email (unique)
- Password (hashed)
- First name and last name (optional)
- Role (ADMIN, USER, MANAGER)
- Active status
- Timestamps

To modify the schema:
1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Generate client: `npm run prisma:generate`

## 🎯 Design Principles

### 1. **Modularity**
- Code is organized into logical modules
- Each module has a single responsibility
- Easy to add/remove features

### 2. **Separation of Concerns**
- Controllers handle HTTP
- Services handle business logic
- Database layer handles data access
- Clear boundaries between layers

### 3. **DRY (Don't Repeat Yourself)**
- Reusable utilities
- Shared constants
- Common middlewares

### 4. **Type Safety**
- Full TypeScript support
- Strict type checking
- Better IDE support and refactoring

### 5. **Error Handling**
- Centralized error handling
- Custom error classes
- Consistent error responses

### 6. **Security First**
- Input validation
- Authentication & authorization
- Security headers
- Password hashing

### 7. **Logging**
- Structured logging
- Log rotation
- Different log levels
- Error tracking

## 🔧 Configuration

All configuration is managed through environment variables:

```env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ims_db?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=info
LOG_DIR=logs
```

## 🌱 Scalability Considerations

1. **Horizontal Scaling**: Stateless design allows multiple instances
2. **Database Connection Pooling**: Prisma handles connection pooling
3. **Caching**: Ready to add Redis for caching
4. **Load Balancing**: Stateless design supports load balancers
5. **Microservices**: Modular structure can be split into microservices
6. **API Versioning**: Non-breaking changes through versioning

## 🧪 Testing (To Be Implemented)

Recommended testing structure:
- Unit tests: `src/**/*.test.ts`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`
- Testing frameworks: Jest, Supertest

## 📚 Adding New Features

### Example: Adding a new "Products" module

1. **Create service**
   ```typescript
   // src/services/product.service.ts
   ```

2. **Create controller**
   ```typescript
   // src/controllers/product.controller.ts
   ```

3. **Create routes**
   ```typescript
   // src/routes/v1/product.routes.ts
   ```

4. **Create validators**
   ```typescript
   // src/validators/product.validator.ts
   ```

5. **Register routes**
   ```typescript
   // In src/routes/v1/index.ts
   import productRoutes from './product.routes';
   router.use('/products', productRoutes);
   ```

6. **Add Prisma model**
   ```prisma
   // In prisma/schema.prisma
   model Product {
     // fields...
   }
   ```

7. **Run migration**
   ```bash
   npm run prisma:migrate
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Submit a pull request

## 📄 License

ISC

## 👥 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

Built with ❤️ using Node.js, Express, TypeScript, and Prisma