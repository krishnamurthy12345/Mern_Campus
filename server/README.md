# CampusReview — Server

## Overview

The CampusReview server is a REST API built with Node.js, Express, and MongoDB. It manages authentication, college data, reviews, and role-based authorization.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Express middleware for validation and authentication

## Features

- User registration and login
- Password hashing
- JWT-based authentication
- User profile endpoint
- College CRUD operations
- Review creation and retrieval
- Review update and deletion
- Role-based authorization for administrators
- Request validation and centralized error handling

## Prerequisites

- Node.js and npm
- MongoDB local installation or MongoDB Atlas account

## Installation

Open a terminal in the `server` directory and run:

```bash
npm install
```

## Environment Configuration

Create a `.env` file inside the `server` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=12h
FRONTEND_URL=http://localhost:5173
```

If you implement email-based password recovery, also configure the Resend API key and sender address.

**Important:** Replace the example values with your actual configuration. Do not commit the `.env` file to Git.

## Run the Development Server

```bash
npm run dev
```

If your project does not have a `dev` script, use the appropriate script from `package.json`, for example:

```bash
npm start
```

The API should be available at:

```text
http://localhost:5000
```

## API Endpoints

The exact paths depend on your Express route configuration.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Get the authenticated user's profile |
| GET | `/api/colleges` | Retrieve colleges |
| GET | `/api/colleges/:id` | Retrieve a college by ID |
| POST | `/api/reviews` | Create a review |
| GET | `/api/reviews` | Retrieve reviews, if supported by the configured route |
| POST | `/api/auth/forgot-password` | Request a password reset, if implemented |
| POST | `/api/auth/reset-password` | Reset a password, if implemented |

Other update and delete routes may be available depending on the controllers and route files.

## Project Structure

```text
server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── validators/
├── .env
├── package.json
└── README.md
```

## Security Notes

- Passwords must be hashed before storage.
- Protect private endpoints with authentication middleware.
- Enforce authorization checks for administrator actions.
- Keep JWT secrets and database credentials private.
- Validate incoming request data.
