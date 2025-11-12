# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Health Check

### Check Server Health
**GET** `/api/health`

Check if the server is running and healthy.

**Response:**
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

---

## Authentication

All authentication endpoints are under `/api/v1/auth`.

### Register User
**POST** `/api/v1/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, and number
- `firstName`: Optional, minimum 2 characters
- `lastName`: Optional, minimum 2 characters

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses:**
- `409 Conflict`: Email already exists
- `422 Unprocessable Entity`: Validation error

---

### Login
**POST** `/api/v1/auth/login`

Authenticate a user and get access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account is inactive

---

### Refresh Token
**POST** `/api/v1/auth/refresh`

Get a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token

---

### Get Current User Profile
**GET** `/api/v1/auth/me`

Get the profile of the currently authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

---

### Logout
**POST** `/api/v1/auth/logout`

Logout the current user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Note:** In a production environment, you may want to implement token blacklisting or refresh token revocation.

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (only in development)"
}
```

### Validation Error Format
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

---

## HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

---

## Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Expiration
- Access Token: 7 days (configurable via `JWT_EXPIRES_IN`)
- Refresh Token: 30 days (configurable via `JWT_REFRESH_EXPIRES_IN`)

When an access token expires, use the `/auth/refresh` endpoint with the refresh token to get a new access token.

---

## Rate Limiting

Rate limiting is configurable via environment variables:
- Window: 15 minutes (configurable via `RATE_LIMIT_WINDOW_MS`)
- Max Requests: 100 per window (configurable via `RATE_LIMIT_MAX_REQUESTS`)

When rate limit is exceeded, the API will respond with `429 Too Many Requests`.

---

## CORS

CORS is enabled for origins specified in the `CORS_ORIGIN` environment variable.

Default allowed origins:
- `http://localhost:3000`
- `http://localhost:3001`

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
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
    "password": "SecurePass123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer <access_token>"
```

---

## Testing with Postman

1. Create a new collection for the API
2. Set base URL as a collection variable: `{{baseUrl}}` = `http://localhost:3000/api/v1`
3. Add requests for each endpoint
4. Set up environment variables for `accessToken` and `refreshToken`
5. Use Pre-request Scripts to automatically set the Authorization header

---

## Future Endpoints

As you expand the application, you can add more modules under `/api/v1/`:

- `/api/v1/users` - User management
- `/api/v1/products` - Product management
- `/api/v1/orders` - Order management
- etc.

Each module should follow the same structure:
- Controller for handling HTTP
- Service for business logic
- Validator for request validation
- Routes for endpoint definitions
