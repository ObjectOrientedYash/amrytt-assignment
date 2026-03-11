# Blog Platform REST API

A RESTful backend API for a blog platform that supports user authentication, post management, nested comments, and real-time notifications.

The system allows users to create posts, comment on posts (including replies), and receive real-time updates using WebSockets.

Key design decisions:

- PostgreSQL + Sequelize for structured relational data and migrations
- JWT authentication for stateless API security
- Socket.IO for real-time events
- Swagger for automatic API documentation

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT (jsonwebtoken)
- bcryptjs
- Socket.IO
- Swagger UI Express

---

# Setup Instructions

## 1. Prerequisites

Make sure the following are installed:

- Node.js (v18 or higher)
- PostgreSQL
- npm

---

## 2. Clone Repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Environment Variables

Create a `.env` file in the project root.

Copy the example configuration:

```bash
cp .env.example .env
```

### Example `.env.example`

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=blog_platform

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
```

⚠ Never commit the `.env` file to GitHub.

---

## 5. Database Setup

Make sure PostgreSQL is running locally.

Create the database:

```bash
npx sequelize-cli db:create
```

Run migrations:

```bash
npx sequelize-cli db:migrate
```

---

Seed the database with the default admin user:

```bash
npx sequelize-cli db:seed:all
```

This will create a default **admin user** in the database using the configured seeder.

---

## 6. Run the Application

Run in development mode:

```bash
npm run dev
```

Run in production mode:

```bash
npm start
```

Server runs at:

```
http://localhost:3000
```

---

# API Documentation

Swagger documentation is available at:

```
http://localhost:3000/api-docs
```

---

# API Endpoints

## Authentication

### Register

POST `/api/auth/register`

Request

```json
{
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
}
```

Response

```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "username": "john",
            "email": "john@example.com"
        }
    }
}
```

---

### Login

POST `/api/auth/login`

Request

```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

Response

```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "accessToken": "jwt_access_token",
        "refreshToken": "jwt_refresh_token",
        "user": {
            "id": 5,
            "username": "yashcoder",
            "role": "user"
        }
    },
    "error": null
}
```

---

## Posts

| Method | Endpoint         | Access    |
| ------ | ---------------- | --------- |
| GET    | `/api/posts`     | Public    |
| GET    | `/api/posts/:id` | Public    |
| POST   | `/api/posts`     | Protected |
| PUT    | `/api/posts/:id` | Protected |
| DELETE | `/api/posts/:id` | Protected |

---

## Comments

| Method | Endpoint                      | Access    |
| ------ | ----------------------------- | --------- |
| POST   | `/api/posts/:postId/comments` | Protected |
| GET    | `/api/posts/:postId/comments` | Public    |
| DELETE | `/api/comments/:id`           | Protected |

---

# WebSocket Events

The application uses Socket.IO for real-time communication.

---

## new_post

Broadcasted to all clients when a post is published.

Payload

```json
{
    "message": "New post published",
    "postId": 1
}
```

---

## new_comment

Sent to the post author when someone comments on their post.

Payload

```json
{
    "message": "Someone commented on your post.",
    "postId": 4,
    "postAuthorId": 2,
    "commentId": 10
}
```

---

## join_post

Client joins a post room to receive view updates.

Payload

```json
{
    "postId": 4
}
```

---

## post_viewed

Emitted to all clients viewing a post when view count updates.

Payload

```json
{
    "postId": 4,
    "views": 25
}
```

---

# Summary

This backend API demonstrates:

- JWT based authentication
- RESTful API design
- PostgreSQL relational data modeling
- Sequelize migrations
- Nested comments
- Real-time notifications with Socket.IO
- Swagger API documentation
