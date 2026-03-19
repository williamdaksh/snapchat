# 👻 Snapchat Clone — MERN Stack

A full-stack Snapchat clone with exact Snapchat UI — React frontend + Node.js/Express/MongoDB backend.

---

## 📁 Project Structure

```
snapchat-clone/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Login, Register, Logout, Me
│   ├── middleware/
│   │   └── auth.js              # JWT protect middleware
│   ├── models/
│   │   ├── User.js              # User schema (streaks, snap score, friends)
│   │   └── Snap.js              # Snap schema (media, recipients, timer)
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   ├── userRoutes.js        # /api/users/*
│   │   └── snapRoutes.js        # /api/snaps/*
│   ├── .env                     # Environment variables
│   ├── .env.example             # Template for .env
│   ├── package.json
│   └── server.js                # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js   # Global auth state (useReducer + Axios)
    │   ├── pages/
    │   │   ├── LoginPage.js     # Exact Snapchat login UI
    │   │   ├── LoginPage.css
    │   │   ├── RegisterPage.js  # 3-step sign up wizard
    │   │   ├── RegisterPage.css
    │   │   ├── HomePage.js      # Camera + Chat + Stories tabs
    │   │   └── HomePage.css
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.js               # Routes + Auth guards
    │   └── index.js
    ├── .env
    └── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` — set your MongoDB URI:
```
MONGO_URI=mongodb://localhost:27017/snapchat_clone
JWT_SECRET=change_this_to_a_random_secret_string
```

Start backend:
```bash
npm run dev       # with nodemon (auto-restart)
# or
npm start         # production
```

Backend runs on: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login (returns JWT) |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET  | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/check-username` | — | Username availability |
| POST | `/api/auth/forgot-password` | — | Send reset link |
| GET  | `/api/users/search?q=name` | ✅ | Search users |
| GET  | `/api/users/:username` | ✅ | Public profile |
| POST | `/api/users/add-friend` | ✅ | Add friend |
| POST | `/api/snaps/send` | ✅ | Send snap |
| GET  | `/api/snaps/inbox` | ✅ | Inbox |
| PATCH| `/api/snaps/:id/open` | ✅ | Mark snap opened |
| GET  | `/api/health` | — | Health check |

---

## ✨ Features

### Frontend
- 📱 Exact Snapchat UI (white login, dark camera)
- 🔐 Login + 3-step Register with validation
- 🔑 Auto-save credentials (localStorage, silent)
- 👁️ Password show/hide + strength meter
- 📷 Camera screen with fake viewfinder + flip + flash
- 💬 Chat tab with friend list + unread badges
- 📸 Stories tab with Discover section
- 👤 Profile modal (streak, snap score, friends)
- 🔄 Tab navigation (Chat → Camera → Stories)
- 🛡️ Route guards (public + protected)

### Backend
- 🔒 JWT authentication (7d / 30d remember me)
- 🔑 bcrypt password hashing (12 rounds)
- 🛡️ Account lockout after 5 failed attempts (2 hours)
- ⚡ Rate limiting on auth routes (20 req/15min)
- ✅ Input validation with express-validator
- 🗄️ Mongoose models with virtual fields
- ⏱️ Auto-expire snaps (TTL index, 24 hours)

---

## 🔧 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Validation | express-validator |
| Security | express-rate-limit, CORS |

---

## 📝 Notes

- This is a **clone for learning purposes only**
- Not affiliated with Snap Inc.
- To add Google OAuth: use `passport-google-oauth20`
- To add real-time (WebSocket): use `socket.io`
