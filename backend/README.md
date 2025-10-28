# User Registration Backend (NestJS)

A minimal NestJS backend for user registration with MongoDB (Mongoose), DTO validation, password hashing, and CORS for a React frontend.

## Features

- POST `/user/register` endpoint
- Validates email and password (min 8 chars)
- Checks for existing email
- Hashes password with bcrypt
- Uses environment variables for sensitive config
- CORS enabled for React frontend

## Requirements

- Node.js 18+
- MongoDB running locally or accessible via URI

## Setup

1. Copy environment file:

```powershell
Copy-Item .env.example .env
```

2. Edit `.env` as needed (e.g., `MONGODB_URI`, `FRONTEND_ORIGIN`).

3. Install dependencies:

```powershell
npm install
```

4. Start in development mode:

```powershell
npm run start:dev
```

The server will start on `http://localhost:3000` by default.

## API

- POST `/user/register`
  - Body: `{ "email": string, "password": string (>= 8 chars) }`
  - Success: `200 OK` with `{ success: true, data: { _id, email, createdAt } }`
  - Errors:
    - `400 Bad Request` for validation errors
    - `409 Conflict` if email already registered
    - `500 Internal Server Error` for unexpected failures

## Notes

- Passwords are never returned in responses.
- A unique index on `email` is defined at the schema level; duplicate key errors are handled.
- CORS is enabled with `FRONTEND_ORIGIN` or set to `true` if not provided (allow all origins).
