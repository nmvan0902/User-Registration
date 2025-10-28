# User Registration Backend (NestJS)

A minimal NestJS backend for user registration with MongoDB (Mongoose), DTO validation, password hashing, and CORS for a React frontend.

## Features

- POST `/user/register` endpoint
- POST `/user/login` endpoint (basic)
- Optional JWT-based flow:
  - POST `/user/login-jwt`: returns `accessToken` and sets `refresh_token` (HTTP-only cookie)
  - POST `/user/refresh`: rotates and returns new `accessToken`, refresh cookie updated
  - POST `/user/logout`: clears refresh cookie and revokes stored refresh token
- Validates email and password (min 8 chars)
- Checks for existing email
- Hashes password with bcrypt
- Uses environment variables for sensitive config
- CORS enabled for React frontend (cookies supported when `FRONTEND_ORIGIN` is a specific origin)

## Requirements

- Node.js 18+
- MongoDB running locally or accessible via URI

## Setup

1. Copy environment file:

```powershell
Copy-Item .env.example .env
```

2. Edit `.env` as needed (e.g., `MONGODB_URI`, `FRONTEND_ORIGIN`).

  For JWT/Refresh flow also set these (see `.env.example`):

  - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
  - `JWT_ACCESS_TTL` (e.g. `15m`) and `JWT_REFRESH_TTL` (e.g. `7d`)

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

- POST `/user/login`
  - Body: `{ "email": string, "password": string (>= 8 chars) }`
  - Success: `200 OK` with `{ success: true, data: { _id, email, createdAt } }`
  - Errors:
    - `400 Bad Request` for validation errors
    - `401 Unauthorized` if email or password is incorrect
    - `500 Internal Server Error` for unexpected failures

- POST `/user/login-jwt` (optional JWT flow)
  - Body: `{ "email": string, "password": string }`
  - Success: `200 OK` with `{ success: true, data: { user, accessToken } }` and `refresh_token` set as HTTP-only cookie

- POST `/user/refresh` (optional JWT flow)
  - Reads `refresh_token` cookie, validates and rotates
  - Success: `200 OK` with `{ success: true, data: { accessToken } }`

- POST `/user/logout`
  - Clears refresh cookie and revokes stored refresh token (if present)
  - Success: `200 OK` with `{ success: true, data: 'Logged out' }`

## Notes

- Passwords are never returned in responses.
- A unique index on `email` is defined at the schema level; duplicate key errors are handled.
- For credentials (cookies) to work across domains, set `FRONTEND_ORIGIN` to the exact frontend origin (e.g., `http://localhost:5173`) and ensure frontend fetch uses `credentials: 'include'`.
