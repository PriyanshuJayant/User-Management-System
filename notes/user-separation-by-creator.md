# How User Separation by Creator Works

## Overview

This document explains how we implemented **user data isolation** - where each logged-in user only sees the entries/users they created.

---

## The Concept

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     USER DATA ISOLATION                                 │
└─────────────────────────────────────────────────────────────────────────┘

User A (logged in)              User B (logged in)
     │                                │
     ▼                                ▼
┌──────────────┐               ┌──────────────┐
│ Creates:     │               │ Creates:     │
│ - John       │               │ - Alice      │
│ - Jane       │               │ - Bob        │
│ - Mike       │               │ - Carol      │
└──────────────┘               └──────────────┘
     │                                │
     ▼                                ▼
┌──────────────┐               ┌──────────────┐
│ Dashboard    │               │ Dashboard    │
│ Shows:       │               │ Shows:       │
│ - John       │               │ - Alice      │
│ - Jane       │               │ - Bob        │
│ - Mike       │               │ - Carol      │
└──────────────┘               └──────────────┘

Each user ONLY sees entries they created!
```

---

## Step-by-Step Implementation

### Step 1: Add `createdBy` Field to Schema

**File:** `models/Schema.js`

```javascript
const userSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Stores MongoDB ObjectId
      ref: "user", // References the User collection
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);
```

**What this does:**

- `createdBy` stores the ID of the user who created this entry
- `ref: 'user'` tells Mongoose this references the User model (for population)

---

### Step 2: Authentication Middleware Sets `req.user`

**File:** `middleware/auth.js`

```javascript
function isAuthenticated(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.redirect("/login");
  }

  const user = getUser(sessionId); // Get user from session store

  if (!user) {
    res.clearCookie("sessionId");
    return res.redirect("/login");
  }

  // ✅ IMPORTANT: Attach user data to the request object
  req.user = user; // Now req.user._id is available in all routes

  next();
}
```

**What this does:**

- Checks if user is logged in (has valid session)
- Attaches user data to `req.user`
- All subsequent handlers can access `req.user._id`

---

### Step 3: Apply Middleware to Routes

**File:** `routes/router.js`

```javascript
// Dashboard route - needs authentication
router.route("/dashboard").get(isAuthenticated, handleRenderEntriesPage);

// API route for creating entries - needs authentication for req.user
router
  .route("/api/")
  .get(handleGetUserData)
  .post(isAuthenticated, handleCreateUserSSR); // ← Protected!
```

**What this does:**

- `isAuthenticated` runs BEFORE the handler
- Sets up `req.user` so the handler can use it

---

### Step 4: Save `createdBy` When Creating Entry

**File:** `controller/routes.js`

```javascript
async function handleCreateUserSSR(req, res) {
  try {
    const { fullName, email, age, gender } = req.body;

    // ✅ Get the logged-in user's ID from req.user
    const createdBy = req.user?._id;

    // ✅ Include createdBy when creating the entry
    await Entries.create({
      fullName,
      email,
      age,
      gender,
      createdBy, // ← This links the entry to the logged-in user
    });

    return res.redirect("/dashboard");
  } catch (error) {
    return res.redirect("/dashboard?error=server");
  }
}
```

**What this does:**

- Gets the logged-in user's ID from `req.user._id`
- Saves it in the `createdBy` field of the new entry

---

### Step 5: Filter Entries by `createdBy` When Displaying

**File:** `controller/routes.js`

```javascript
async function handleRenderEntriesPage(req, res) {
  try {
    // ✅ Only find entries where createdBy matches logged-in user
    const allUsers = await Entries.find({ createdBy: req.user?._id });

    return res.render("index", { users: allUsers });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Data",
      error: error,
    });
  }
}
```

**What this does:**

- MongoDB query: `{ createdBy: req.user._id }`
- Only returns entries that belong to the logged-in user
- User A won't see User B's entries

---

## Database Example

### MongoDB Collection: `data`

```json
[
  {
    "_id": "entry1",
    "fullName": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "gender": "male",
    "createdBy": "userA_id", // ← Created by User A
    "createdAt": "2024-12-30T10:00:00Z"
  },
  {
    "_id": "entry2",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "age": 30,
    "gender": "female",
    "createdBy": "userA_id", // ← Created by User A
    "createdAt": "2024-12-30T10:05:00Z"
  },
  {
    "_id": "entry3",
    "fullName": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28,
    "gender": "female",
    "createdBy": "userB_id", // ← Created by User B
    "createdAt": "2024-12-30T11:00:00Z"
  }
]
```

### Query Results:

**When User A logs in:**

```javascript
Entries.find({ createdBy: "userA_id" });
// Returns: John Doe, Jane Smith (2 entries)
```

**When User B logs in:**

```javascript
Entries.find({ createdBy: "userB_id" });
// Returns: Alice Johnson (1 entry)
```

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

1. USER LOGS IN
   └── Session created: { sessionId: "abc", _id: "user123", email: "..." }
   └── Cookie set: sessionId=abc

2. USER VISITS /dashboard
   └── isAuthenticated middleware runs
   └── Reads sessionId from cookie
   └── Gets user from session: getUser("abc") → { _id: "user123" }
   └── Sets req.user = { _id: "user123", email: "..." }
   └── Handler runs: Entries.find({ createdBy: "user123" })
   └── Only shows entries created by this user

3. USER CREATES NEW ENTRY
   └── Form POSTs to /api/
   └── isAuthenticated middleware sets req.user
   └── Handler gets createdBy = req.user._id = "user123"
   └── Entries.create({ ...data, createdBy: "user123" })
   └── Entry saved with createdBy field

4. RESULT
   └── Each user only sees their own entries
   └── Data is isolated between users
```

---

## Key Points to Remember

1. **Schema must have `createdBy` field** - to store who created the entry
2. **Middleware sets `req.user`** - available in all protected routes
3. **Save `createdBy` on create** - link entry to logged-in user
4. **Filter by `createdBy` on read** - only show user's own entries
5. **Apply same logic to update/delete** - user can only modify their own entries

---

## Security Consideration

For update and delete operations, also verify the entry belongs to the user:

```javascript
// Delete - verify ownership
async function handleDeleteUserSSR(req, res) {
  await Entries.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id, // ← Only delete if user owns it
  });
}

// Update - verify ownership
async function handleUpdateUserSSR(req, res) {
  await Entries.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id }, // ← Only update if user owns it
    req.body
  );
}
```

This prevents one user from deleting/editing another user's entries!
