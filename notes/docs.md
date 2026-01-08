# User Management System - Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Branch Structure](#branch-structure)
3. [Technology Stack](#technology-stack)
4. [Project Architecture](#project-architecture)
5. [Features](#features)
6. [Authentication Methods](#authentication-methods)
7. [Installation & Setup](#installation--setup)
8. [API Endpoints](#api-endpoints)
9. [Database Schema](#database-schema)
10. [Folder Structure](#folder-structure)

---

## 🎯 Project Overview

A full-stack **User Management System** built with **Node.js**, **Express**, **MongoDB**, and **EJS** templating. The project demonstrates different authentication strategies (Stateful Session-based and future JWT implementation) with user data isolation.

**Key Concept:** Each authenticated user can only see and manage entries they created, ensuring complete data isolation between users.

---

## 🌿 Branch Structure

| Branch                       | Description                                  | Authentication                  | Status              |
| ---------------------------- | -------------------------------------------- | ------------------------------- | ------------------- |
| **main**                     | Latest stable version with Express-Session   | Express-Session (Stateful)      | ✅ Production-ready |
| **default**                  | Basic CRUD operations without authentication | None                            | ✅ Starter template |
| **Stateful**                 | CRUD + UUID-based session authentication     | UUID + Cookie Parser (Stateful) | ✅ Complete         |
| **Stateful-express-session** | CRUD + Express-Session authentication        | Express-Session (Stateful)      | ✅ Complete         |
| **Stateless**                | CRUD + JWT authentication                    | JWT (Stateless)                 | 🚧 Planned          |

---

## 🛠️ Technology Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js v5.2.1** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose v9.0.2** - MongoDB ODM

### Authentication

- **express-session v1.18.2** - Session management (main branch)
- **uuid v13.0.0** - Session ID generation (Stateful branch)
- **cookie-parser v1.4.7** - Cookie parsing

### View Engine

- **EJS v3.1.10** - Embedded JavaScript templating

### Development

- **nodemon v3.1.11** - Auto-reload during development
- **dotenv v17.2.3** - Environment variable management

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                        │
│                   EJS Views (Frontend)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express Middleware                        │
│  ┌──────────────┬────────────────┬─────────────────────┐  │
│  │   Session    │  Auth Middleware│   Static Files     │  │
│  │  Management  │  (isAuth/Guest) │   (CSS, JS)        │  │
│  └──────────────┴────────────────┴─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Routes Layer                            │
│  ┌──────────────────────┬──────────────────────────────┐  │
│  │  Static Routes       │   API/User Routes            │  │
│  │  (Auth Pages)        │   (CRUD Operations)          │  │
│  └──────────────────────┴──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Controllers                               │
│  ┌──────────────────────┬──────────────────────────────┐  │
│  │  controller/static.js│   controller/routes.js       │  │
│  │  (Login/Signup)      │   (CRUD Handlers)            │  │
│  └──────────────────────┴──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Models (Mongoose)                       │
│  ┌──────────────────────┬──────────────────────────────┐  │
│  │  models/Users.js     │   models/Schema.js           │  │
│  │  (Auth Users)        │   (User Entries)             │  │
│  └──────────────────────┴──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Database                          │
│  ┌──────────────────────┬──────────────────────────────┐  │
│  │  users collection    │   datas collection           │  │
│  │  (Credentials)       │   (User Entries)             │  │
│  └──────────────────────┴──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Authentication & Authorization

- ✅ User registration with validation
- ✅ User login with session management
- ✅ Secure logout with session destruction
- ✅ Protected routes (authentication required)
- ✅ Guest-only routes (redirect if already logged in)

### User Entry Management (CRUD)

- ✅ **Create** - Add new user entries
- ✅ **Read** - View all entries (isolated by creator)
- ✅ **Update** - Edit existing entries
- ✅ **Delete** - Remove entries
- ✅ **User Isolation** - Each user only sees their own entries

### Security Features

- ✅ HTTP-only cookies
- ✅ Session expiration (24 hours)
- ✅ SameSite cookie protection
- ✅ Secure cookies in production
- ✅ Session secret signing

---

## 🔐 Authentication Methods

### Current: Express-Session (Stateful)

**How it works:**

```javascript
// On Login
req.session.userId = user._id;
req.session.user = { _id, name, email, createdAt };
// Express-session automatically:
// 1. Generates session ID
// 2. Stores session data
// 3. Sets signed cookie
```

**Configuration** (`middleware/express-session.js`):

```javascript
{
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,  // Only create session on login
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,  // 24 hours
        sameSite: 'strict'
    }
}
```

**Pros:**

- ✅ Automatic session management
- ✅ Production-ready
- ✅ Can use external stores (MongoDB, Redis)
- ✅ Built-in security features

---

### Previous: UUID + Cookie Parser (Stateful Branch)

**How it worked:**

```javascript
// Manual implementation
const sessionId = uuidv4();
sessionStore.set(sessionId, userData);
res.cookie("sessionId", sessionId);
```

**Comparison:**

| Aspect          | UUID Approach | Express-Session |
| --------------- | ------------- | --------------- |
| Session ID      | Manual (UUID) | Automatic       |
| Storage         | Manual (Map)  | Configurable    |
| Cookie Handling | Manual        | Automatic       |
| Security        | Manual        | Built-in        |
| Code Complexity | High          | Low             |
| Scalability     | Limited       | High            |

---

### Future: JWT (Stateless - Planned)

**Planned Implementation:**

- Token-based authentication
- Stateless (no server-side session storage)
- Suitable for microservices
- Mobile-friendly

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/PriyanshuJayant/User-Management-System.git
cd User-Management-System
```

2. **Choose a branch:**

```bash
# For Express-Session (recommended)
git checkout main

# For UUID-based auth
git checkout Stateful

# For basic CRUD without auth
git checkout default
```

3. **Install dependencies:**

```bash
npm install
```

4. **Create `.env` file:**

```env
_MONGODB_URL=mongodb://localhost:27017/user-management
SESSION_SECRET=your-super-secret-random-string
NODE_ENV=development
PORT=3000
```

5. **Start MongoDB:**

```bash
# If using local MongoDB
mongod
```

6. **Run the application:**

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run prod
```

7. **Access the app:**

```
http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint      | Description        | Auth Required |
| ------ | ------------- | ------------------ | ------------- |
| GET    | `/login`      | Render login page  | Guest only    |
| GET    | `/signup`     | Render signup page | Guest only    |
| POST   | `/api/signup` | Register new user  | No            |
| POST   | `/api/login`  | Login user         | No            |
| GET    | `/api/logout` | Logout user        | Yes           |

### User Entry Routes (CRUD)

| Method | Endpoint     | Description          | Auth Required |
| ------ | ------------ | -------------------- | ------------- |
| GET    | `/`          | Home page            | No            |
| GET    | `/dashboard` | User dashboard       | Yes           |
| GET    | `/api/`      | Get all user entries | Yes           |
| POST   | `/api/`      | Create new entry     | Yes           |
| GET    | `/api/:id`   | Get entry by ID      | Yes           |
| DELETE | `/api/:id`   | Delete entry         | Yes           |
| PATCH  | `/api/:id`   | Update entry         | Yes           |

### Server-Side Rendered Routes

| Method | Endpoint            | Description        | Auth Required |
| ------ | ------------------- | ------------------ | ------------- |
| POST   | `/users`            | Create entry (SSR) | Yes           |
| GET    | `/users/:id/edit`   | Edit page          | Yes           |
| POST   | `/users/:id/update` | Update entry (SSR) | Yes           |
| POST   | `/users/:id/delete` | Delete entry (SSR) | Yes           |

---

## 🗄️ Database Schema

### Users Collection (Authentication)

```javascript
{
    name: String,      // min: 3, max: 50
    email: String,     // unique, lowercase
    password: String,  // (plain text - consider hashing in production)
    createdAt: Date,   // auto-generated
    updatedAt: Date    // auto-generated
}
```

**Model:** `models/Users.js`  
**Collection Name:** `users`

---

### Entries Collection (User Data)

```javascript
{
    createdBy: ObjectId,     // References 'users' collection
    fullName: String,        // min: 3, max: 50
    email: String,           // lowercase
    age: Number,             // min: 1, max: 120
    gender: String,          // enum: ['male', 'female', 'other']
    createdAt: Date,         // auto-generated
    updatedAt: Date          // auto-generated
}
```

**Model:** `models/Schema.js`  
**Collection Name:** `datas`

---

## 📁 Folder Structure

```
User Management System/
│
├── connections/
│   └── mongoDB.js              # MongoDB connection logic
│
├── controller/
│   ├── routes.js               # CRUD operation handlers
│   └── static.js               # Auth handlers (login/signup/logout)
│
├── middleware/
│   ├── auth.js                 # Authentication middleware (isAuthenticated, isGuest)
│   └── express-session.js      # Session configuration
│
├── models/
│   ├── Schema.js               # Entries model (user data)
│   └── Users.js                # Users model (authentication)
│
├── notes/
│   └── user-separation-by-creator.md  # Technical documentation
│
├── public/
│   ├── index.css               # Stylesheets
│   └── transitions.js          # Client-side JavaScript
│
├── routes/
│   ├── router.js               # User entry routes
│   └── static.js               # Authentication routes
│
├── service/
│   ├── auth.js                 # (Legacy) UUID session management
│   └── memory.js               # Memory usage utility
│
├── views/
│   ├── home.ejs                # Landing page
│   ├── index.ejs               # Dashboard (entries list)
│   ├── login.ejs               # Login form
│   └── signup.ejs              # Registration form
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── index.js                    # Application entry point
├── package.json                # Dependencies and scripts
└── README.md                   # Project overview
```

---

## 🔒 Authentication Middleware

### `isAuthenticated` - Protect Routes

```javascript
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  req.user = req.session.user;
  next();
}
```

**Usage:** Apply to routes that require login

```javascript
router.get("/dashboard", isAuthenticated, handleRenderEntriesPage);
```

---

### `isGuest` - Guest-Only Routes

```javascript
function isGuest(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/dashboard");
  }
  next();
}
```

**Usage:** Apply to login/signup pages (redirect if already logged in)

```javascript
router.get("/login", isGuest, handleRender_Login);
```

---

## 🎨 User Data Isolation

### How It Works

Each entry has a `createdBy` field that references the authenticated user:

```javascript
// On Create
await Entries.create({
  fullName: req.body.fullName,
  email: req.body.email,
  age: req.body.age,
  gender: req.body.gender,
  createdBy: req.user._id, // ← User isolation
});

// On Fetch
const entries = await Entries.find({
  createdBy: req.user._id, // ← Only fetch user's entries
});
```

### Visual Representation

```
┌───────────────────────────────────────────────────────────┐
│                  Database: datas                          │
├───────────────────────────────────────────────────────────┤
│  _id  │  fullName  │  email  │  createdBy (User ID)     │
├───────────────────────────────────────────────────────────┤
│  001  │  John Doe  │  j@.com │  user123 ← User A        │
│  002  │  Jane Doe  │  ja@.co │  user123 ← User A        │
│  003  │  Alice     │  a@.com │  user456 ← User B        │
│  004  │  Bob       │  b@.com │  user456 ← User B        │
└───────────────────────────────────────────────────────────┘

User A sees only: John Doe, Jane Doe
User B sees only: Alice, Bob
```

---

## 🔧 Environment Variables

| Variable         | Description                    | Example                                     |
| ---------------- | ------------------------------ | ------------------------------------------- |
| `_MONGODB_URL`   | MongoDB connection string      | `mongodb://localhost:27017/user-management` |
| `SESSION_SECRET` | Secret key for session signing | `random-string-min-32-chars`                |
| `NODE_ENV`       | Environment mode               | `development` or `production`               |
| `PORT`           | Server port                    | `3000`                                      |

---

## 📊 Scripts

```json
{
  "dev": "nodemon index.js", // Development with auto-reload
  "prod": "node index.js" // Production mode
}
```

**Usage:**

```bash
npm run dev   # Development
npm run prod  # Production
```

---

## 🚦 Application Flow

### 1. New User Registration

```
User → /signup → POST /api/signup → Validate → Save to DB → Redirect to /login
```

### 2. User Login

```
User → /login → POST /api/login → Validate Credentials
     → Create Session → Set Cookie → Redirect to /dashboard
```

### 3. Create Entry (Authenticated)

```
User → /dashboard → POST /users → Check Auth → Save with createdBy
     → Redirect to /dashboard
```

### 4. View Entries (Isolated)

```
User → /dashboard → GET /dashboard → Check Auth
     → Fetch entries WHERE createdBy = userId → Render
```

### 5. Logout

```
User → /api/logout → Destroy Session → Clear Cookie → Redirect to /login
```

---

## 🔐 Security Best Practices

### Current Implementation

- ✅ HTTP-only cookies (prevent XSS)
- ✅ SameSite strict (prevent CSRF)
- ✅ Session expiration (24 hours)
- ✅ Signed cookies (tamper-proof)
- ✅ Secure cookies in production (HTTPS only)

### Recommended Improvements

- 🔄 Hash passwords (use bcrypt)
- 🔄 Add rate limiting (prevent brute force)
- 🔄 Input sanitization (prevent injection)
- 🔄 HTTPS in production
- 🔄 CORS configuration
- 🔄 Helmet.js for security headers

---

## 🎯 Future Enhancements

### Planned Features

- [ ] JWT authentication (Stateless branch)
- [ ] Password hashing with bcrypt
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile page
- [ ] Search and filter entries
- [ ] Pagination
- [ ] Role-based access control (Admin/User)
- [ ] API rate limiting

---

## 🐛 Troubleshooting

### Common Issues

**1. Session not persisting:**

- Check `saveUninitialized: false` in session config
- Ensure `SESSION_SECRET` is set in `.env`

**2. Cannot access dashboard after login:**

- Verify `req.session.userId` is being set correctly
- Check middleware order in `index.js`

**3. MongoDB connection error:**

- Ensure MongoDB is running
- Verify `_MONGODB_URL` in `.env`

**4. Cookie not being set:**

- Check cookie configuration
- In development, ensure `secure: false`

---

## 📝 Notes

- This project uses **plain text passwords** for demonstration. In production, always hash passwords using bcrypt or similar.
- The `Stateful` branch uses UUID + Map for sessions (not production-ready for scaled apps).
- The `main` branch uses express-session, which is production-ready and can be configured with external stores like Redis or MongoDB.

---

## 👨‍💻 Author

**Priyanshu Jayant**

- GitHub: [@PriyanshuJayant](https://github.com/PriyanshuJayant)
- Repository: [User-Management-System](https://github.com/PriyanshuJayant/User-Management-System)

---

## 📜 License

ISC

---

**Last Updated:** January 5, 2026  
**Current Branch:** Stateful-express-session  
**Version:** 1.0.0
