# Quick Start Guide

Get the IMS Backend API up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd ims-backend

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
# Required: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
```

**Example .env:**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/ims_db?schema=public"
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 4. Start Development Server

```bash
# Start with hot reload
npm run dev
```

The server will start at `http://localhost:3000`

## Quick Test

### Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "UP",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "development"
  }
}
```

### Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

Save the `accessToken` from the response!

### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Using Docker (Alternative)

### With Docker Compose

```bash
# Start all services (API + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The API will be available at `http://localhost:3000`

### Build Docker Image Only

```bash
# Build image
docker build -t ims-backend .

# Run container (requires external PostgreSQL)
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  -e JWT_REFRESH_SECRET="your-refresh-secret" \
  ims-backend
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |

## Project Structure Overview

```
src/
├── config/          # Environment configuration
├── routes/          # API endpoints (v1/)
├── controllers/     # Request handlers
├── services/        # Business logic
├── middlewares/     # Auth, validation, rate limiting
├── database/        # Prisma client
├── validators/      # Request validation
├── utils/           # Helper functions
├── types/           # TypeScript types
├── constants/       # App constants
└── logger/          # Winston logging
```

## Next Steps

1. ✅ **Read the Documentation**
   - [README.md](README.md) - Full documentation
   - [API.md](API.md) - API reference
   - [STRUCTURE.md](STRUCTURE.md) - Architecture details

2. ✅ **Explore the Code**
   - Start with `src/server.ts` - Entry point
   - Check `src/routes/v1/auth.routes.ts` - API endpoints
   - Review `src/services/auth.service.ts` - Business logic

3. ✅ **Test the API**
   - Use Postman or cURL
   - Try all authentication endpoints
   - Check rate limiting (5 requests/15min on auth)

4. ✅ **Add Your Features**
   - Create new modules in `src/modules/`
   - Add new routes in `src/routes/v1/`
   - Follow the existing patterns

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `createdb ims_db`

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

### Build Errors
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Getting Help

- 📚 Check [README.md](README.md) for detailed documentation
- 🔍 Review [STRUCTURE.md](STRUCTURE.md) for architecture
- 📖 See [API.md](API.md) for API reference
- 🐛 Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for complete overview

## Production Deployment

When ready for production:

1. Set `NODE_ENV=production`
2. Update JWT secrets to strong values
3. Configure proper DATABASE_URL
4. Build: `npm run build`
5. Start: `npm start`
6. Set up process manager (PM2, systemd)
7. Configure reverse proxy (nginx)
8. Set up SSL certificate
9. Enable monitoring

---

**Happy Coding! 🚀**

The backend is ready to use. Start building your application!
