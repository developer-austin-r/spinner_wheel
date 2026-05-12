# NestJS Backend Authentication System

This documentation covers the complete authentication system implementation for the NestJS backend.

## Overview

A production-ready authentication system built with NestJS, featuring JWT-based authentication, bcrypt password hashing, and role-based access control using Prisma ORM with PostgreSQL.

## Technology Stack

- **Framework**: NestJS 11
- **Authentication**: Passport.js with JWT & Local strategies
- **Database**: PostgreSQL with Prisma ORM
- **Password Hashing**: bcrypt
- **Validation**: class-validator & class-transformer
- **Environment**: @nestjs/config

## Project Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── local-auth.guard.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   ├── user/
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── role/
│   │   ├── role.service.ts
│   │   └── role.module.ts
│   ├── prisma/
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── .env
└── package.json
```

## Database Schema

### Role Table
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  role_name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Seed Values:**
- Role: Admin, Slug: admin
- Role: Super Admin, Slug: super_admin

### User Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL (bcrypt hashed),
  phone_number TEXT,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  deleted_at TIMESTAMP (soft delete support),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gym_saas"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install --legacy-peer-deps
```

### 2. Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed default roles
npm run prisma:seed
```

### 3. Start Development Server
```bash
npm run start:dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### 1. Register User
**POST** `/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "+1234567890"
}
```

Response (200 OK):
```json
{
  "success": true,
  "message": "User registered successfully",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": {
      "id": 1,
      "roleName": "Admin",
      "slug": "admin"
    }
  }
}
```

### 2. Login User
**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": {
      "id": 1,
      "roleName": "Admin",
      "slug": "admin"
    }
  }
}
```

### 3. Get User Profile
**GET** `/auth/profile`

Headers:
```
Authorization: Bearer {access_token}
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234467890",
    "role": {
      "id": 1,
      "roleName": "Admin",
      "slug": "admin"
    }
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 6 characters long"
  ],
  "error": "Bad Request"
}
```

### Conflict Error - Email Already Exists (409)
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

### Unauthorized Error (401)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

## Security Features

1. **Password Hashing**: bcrypt with salt rounds of 10
2. **JWT Tokens**: Secure token-based authentication
3. **Token Expiration**: Configurable expiration time (default: 7 days)
4. **Soft Deletes**: Users can be soft deleted (not permanently removed)
5. **Input Validation**: Comprehensive validation using class-validator
6. **CORS Enabled**: Cross-origin requests supported
7. **Protected Routes**: JWT guard protects sensitive endpoints
8. **Environment Variables**: Secrets stored securely in environment

## Key Services

### AuthService
Handles authentication logic:
- `register()`: Create new user with hashed password
- `login()`: Validate credentials and issue JWT
- `validateUser()`: Verify user credentials
- `getProfile()`: Retrieve authenticated user details

### UserService
Manages user operations:
- `findByEmail()`: Query user by email
- `findById()`: Query user by ID
- `create()`: Create new user
- `softDelete()`: Soft delete user

### RoleService
Manages role operations:
- `findBySlug()`: Query role by slug
- `findById()`: Query role by ID
- `findAll()`: Retrieve all roles

## Strategies & Guards

### JWT Strategy
Validates JWT tokens from Authorization header and extracts user information.

### Local Strategy
Validates email and password credentials (used for login endpoint).

### JWT Auth Guard
Protects routes requiring valid JWT token in Authorization header.

### Local Auth Guard
Protects routes requiring email/password validation.

## Common Commands

```bash
# Development
npm run start:dev

# Build production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Database operations
npm run prisma:migrate       # Create new migration
npm run prisma:seed         # Run seed script
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate:prod # Deploy migrations to production

# Code quality
npm run lint    # Lint and fix code
npm run format  # Format code
```

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get Profile (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Production Considerations

1. **Change JWT_SECRET**: Update the JWT secret in production environment
2. **Database Security**: Use strong PostgreSQL credentials
3. **HTTPS**: Enable HTTPS/TLS in production
4. **Rate Limiting**: Consider adding rate limiting for auth endpoints
5. **Logging**: Implement proper logging for security events
6. **Monitoring**: Monitor failed login attempts
7. **Token Refresh**: Consider implementing refresh tokens for enhanced security
8. **Password Policy**: Enforce strong password policies
9. **2FA**: Consider adding two-factor authentication
10. **Audit Logs**: Maintain audit logs for authentication events

## Troubleshooting

### Database Connection Error
Ensure PostgreSQL is running and connection string in `.env` is correct:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gym_saas"
```

### Port Already in Use
Change the PORT in `.env` or use a different port:
```
PORT=3001
```

### JWT Token Expired
Get a new token by logging in again. Adjust JWT_EXPIRES_IN in `.env` if needed.

### Prisma Client Not Generated
Run:
```bash
npm run prisma:generate
```

## Next Steps

1. Implement role-based access control (RBAC) middleware
2. Add refresh token functionality
3. Implement email verification
4. Add password reset functionality
5. Implement two-factor authentication (2FA)
6. Add OAuth integration (Google, GitHub, etc.)
7. Implement API rate limiting
8. Add request logging and monitoring
9. Implement audit logs
10. Add metrics and analytics

---

For more information about NestJS, visit: https://docs.nestjs.com
For Prisma documentation, visit: https://www.prisma.io/docs
