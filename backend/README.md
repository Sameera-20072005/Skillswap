# SkillSwap Backend

Node.js + Express + MongoDB REST API for the SkillSwap peer-to-peer skill exchange platform.

## Prerequisites

- Node.js 18+
- MongoDB running locally on port 27017 (or update `MONGO_URI` in `.env`)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (edit .env if needed)
# Default values work for local development

# 3. Start development server
npm run dev

# 4. Start production server
npm start
```

Server runs on **http://localhost:5000**

---

## Environment Variables (`.env`)

| Variable        | Default                                    | Description              |
|-----------------|--------------------------------------------|--------------------------|
| `PORT`          | `5000`                                     | Server port              |
| `MONGO_URI`     | `mongodb://localhost:27017/skillswap`      | MongoDB connection string |
| `JWT_SECRET`    | `skillswap_jwt_secret_key_2024`            | JWT signing secret       |
| `JWT_EXPIRES_IN`| `7d`                                       | Token expiry             |

---

## Folder Structure

```
skillswap-backend/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # register, login, getProfile
│   │   ├── userController.js   # getAllUsers, getUserById, updateProfile
│   │   ├── skillController.js  # getSkills, createSkill, getSkillById
│   │   ├── exchangeController.js # full exchange lifecycle
│   │   └── feedbackController.js # submit & fetch feedback
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── ExchangeRequest.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── exchangeRoutes.js
│   │   └── feedbackRoutes.js
│   └── server.js               # Express app entry point
├── .env
├── .gitignore
└── package.json
```

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint             | Auth | Description        |
|--------|----------------------|------|--------------------|
| POST   | `/api/auth/register` | No   | Register new user  |
| POST   | `/api/auth/login`    | No   | Login              |
| GET    | `/api/auth/profile`  | Yes  | Get current user   |

**POST /api/auth/register**
```json
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "password": "secret123",
  "campus": "MIT",
  "bio": "Python developer",
  "skillsOffered": ["Python", "Django"],
  "skillsNeeded": ["UI/UX Design"],
  "availability": ["Mon 6-8 PM"]
}
```
Response:
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "Alex Chen", "skillCredits": 0, "level": "Beginner", ... }
}
```

**POST /api/auth/login**
```json
{ "email": "alex@example.com", "password": "secret123" }
```
Response: same shape as register.

---

### Users

| Method | Endpoint              | Auth | Description                        |
|--------|-----------------------|------|------------------------------------|
| GET    | `/api/users`          | Yes  | All users (supports ?search=&level=&campus=) |
| GET    | `/api/users/:id`      | Yes  | Single user by ID                  |
| PUT    | `/api/users/profile`  | Yes  | Update current user's profile      |

---

### Skills

| Method | Endpoint          | Auth | Description       |
|--------|-------------------|------|-------------------|
| GET    | `/api/skills`     | Yes  | All skills        |
| POST   | `/api/skills`     | Yes  | Create a skill    |
| GET    | `/api/skills/:id` | Yes  | Single skill      |

**POST /api/skills**
```json
{ "name": "Python", "category": "Programming", "level": "Intermediate" }
```

---

### Exchange Requests

| Method | Endpoint                          | Auth | Description                          |
|--------|-----------------------------------|------|--------------------------------------|
| POST   | `/api/exchange/request`           | Yes  | Send a new exchange request          |
| PUT    | `/api/exchange/accept/:id`        | Yes  | Accept (provider only) → scheduled  |
| PUT    | `/api/exchange/reject/:id`        | Yes  | Reject (provider only)               |
| PUT    | `/api/exchange/complete/:id`      | Yes  | Mark session complete (either party) |
| GET    | `/api/exchange/all`               | Yes  | All exchanges for current user       |
| GET    | `/api/exchange/my-requests`       | Yes  | Exchanges current user sent          |
| GET    | `/api/exchange/received-requests` | Yes  | Exchanges current user received      |
| PUT    | `/api/exchange/:id/meeting-link`  | Yes  | Add/update meeting link              |

**POST /api/exchange/request**
```json
{
  "providerId": "<userId>",
  "skillOffered": "Python",
  "skillRequested": "UI/UX Design",
  "sessionDuration": "1 hour",
  "sessionMode": "online",
  "meetingLink": "https://meet.google.com/abc",
  "preferredDate": "2024-02-15",
  "preferredTime": "18:00",
  "message": "Looking forward to learning!"
}
```

**PUT /api/exchange/accept/:id** (optional body)
```json
{ "meetingLink": "https://zoom.us/j/123456" }
```

**PUT /api/exchange/complete/:id**
- Either requester or provider can call this
- When **both** call it: status → `completed`, each user gets +1 skill credit

---

### Feedback

| Method | Endpoint                  | Auth | Description                          |
|--------|---------------------------|------|--------------------------------------|
| POST   | `/api/feedback`           | Yes  | Submit feedback for a completed session |
| GET    | `/api/feedback/:userId`   | Yes  | Get all feedback for a user          |

**POST /api/feedback**
```json
{
  "exchangeId": "<exchangeId>",
  "rating": 5,
  "comment": "Excellent teacher!"
}
```
- Automatically recalculates the reviewee's average `rating` and `reviewCount`

---

## Status Flow

```
pending → accepted (scheduled) → completed
       → rejected
```

## Skill Credit Rules

- +1 credit to **both** users when a session is marked completed by both parties
- Credits are stored on the User document

## Error Response Format

```json
{ "success": false, "message": "Descriptive error message" }
```

## Health Check

```
GET /api/health
→ { "success": true, "message": "SkillSwap API is running" }
```
