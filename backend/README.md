# User Registration Backend

A NestJS backend application for user registration with email validation and password hashing.

## Features

- User registration with email and password
- Email uniqueness validation
- Password hashing using bcrypt
- Input validation using class-validator
- TypeORM integration with MySQL
- Proper error handling and meaningful error messages
- Environment configuration

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=user_registration
   ```

4. Create the MySQL database:
   ```sql
   CREATE DATABASE user_registration;
   ```

## Running the application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

The application will start on `http://localhost:3001`

## API Endpoints

### POST /user/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2025-10-28T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Invalid input data
- **409 Conflict** - User with email already exists
- **500 Internal Server Error** - Server error

## Validation Rules

- **Email**: Must be a valid email format
- **Password**: Must be at least 6 characters long

## Database Schema

### Users Table
- `id` (Primary Key, Auto Increment)
- `email` (String, Unique, Required)
- `password` (String, Required, Hashed)
- `createdAt` (Timestamp, Auto-generated)

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- Email uniqueness is enforced at the database level
- Input validation prevents malicious data
- CORS is configured for frontend communication

## Development

### Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

### Project Structure

```
src/
├── user/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── user-response.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── app.module.ts
└── main.ts
```