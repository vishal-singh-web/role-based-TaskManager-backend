# Role-Based TaskManager

> A simple yet effective task management app with two user roles: **User** (sees only their own tasks) and **Admin** (sees all tasks across all users). Built with React + Node.js/Express + MongoDB.

**Live Demo:** [role-based-task-manager.vercel.app](https://role-based-task-manager.vercel.app)

---

## Table of Contents

- [About](#about)
- [Quick Start (Demo)](#quick-start-demo)
- [How It Works](#how-it-works)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Backend Repository](#backend-repository)
- [Author](#author)

---

## About

Role-Based TaskManager demonstrates a **simple but practical role-based access control (RBAC)** system:

- **Regular Users** can only see and manage their own tasks.
- **Admin Users** can see and manage all tasks in the system, regardless of who created them.

This is a great portfolio project to showcase understanding of authentication, authorization, and full-stack development.

---

## Quick Start (Demo)

Want to try it right now? Use the pre-configured admin account:

| Field | Value |
|-------|-------|
| **Email** | `admin@hyperverge.com` |
| **Password** | `admin123` |

1. Go to https://role-based-task-manager.vercel.app
2. Click **Login**
3. Enter the credentials above
4. You'll see **all tasks** from all users in the system

**Want to test as a regular user?**  
Create a new account on the signup page. Regular users will only see their own tasks.

---

## How It Works

1. User registers or logs in with email and password.
2. Backend returns a JWT token and the user's role (`"user"` or `"admin"`).
3. Frontend stores the token and role in localStorage.
4. When fetching tasks:
   - **User role**: Backend returns only that user's tasks.
   - **Admin role**: Backend returns all tasks from all users.
5. Frontend conditionally renders UI based on the role.

---

## User Roles

### User Role

- Can create new tasks.
- Can only see **their own tasks**.
- Can only edit/delete **their own tasks**.
- Cannot access admin features.
- Cannot see tasks created by other users.

### Admin Role

- Can see **all tasks** in the system (from all users).
- Can edit or delete any task.
- Has full visibility into the platform.
- Pre-configured admin account: `admin@hyperverge.com` / `admin123`

---

## Tech Stack

### Frontend

- **React** (Create React App)  
- **JavaScript (ES6+)**  
- **CSS / Bootstrap (or your styling choice)**  
- **Fetch API** for HTTP requests  
- **localStorage** for token and user data persistence  

### Backend

- **Node.js**  
- **Express.js**  
- **MongoDB Atlas**  
- **Mongoose** (ODM)  
- **JWT (jsonwebtoken)**  
- **bcryptjs** (password hashing)  
- **CORS & dotenv**  

---

## Project Structure

### Frontend
```
role-based-TaskManager/
├── public/
│ └── index.html
├── src/
│ ├── components/
│ │ ├── Navbar.js # Nav with logout/user info
│ │ ├── TaskList.js # Display tasks based on role
│ │ ├── TaskForm.js # Create task form
│ │ └── PrivateRoute.js # Protected route wrapper (optional)
│ ├── pages/
│ │ ├── Login.js # Login page
│ │ ├── Signup.js # Registration page
│ │ └── Dashboard.js # Main task view (filtered by role)
│ ├── App.js # Main app + routing
│ ├── index.js # Entry point
│ └── index.css # Global styles
├── package.json
└── README.md
```

### Backend

See: [role-based-TaskManager-backend](https://github.com/vishal-singh-web/role-based-TaskManager-backend)
```
role-based-TaskManager-backend/
├── routes/
│ ├── auth.js # /api/auth/signup, /api/auth/login
│ └── tasks.js # /api/tasks (role-based filtering)
├── models/
│ ├── User.js # User schema with role field
│ └── Task.js # Task schema with userId field
├── middleware/
│ └── auth.js # JWT verification middleware
├── index.js # Server entry point
├── .env # (not committed) MongoDB URI, JWT_SECRET, etc.
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Backend running (local or deployed)

### Installation

1. **Clone the repository**

git clone https://github.com/vishal-singh-web/role-based-TaskManager.git
cd role-based-TaskManager

text

2. **Install dependencies**

npm install

3. **Create `.env` file**

In the project root, create a `.env` file:

REACT_APP_API_URL=http://localhost:5000


For production (Vercel):

REACT_APP_API_URL=https://your-backend-on-render.onrender.com

4. **Run locally**

npm start


Open http://localhost:3000 in your browser.

---

## Available Scripts

- `npm start` – Runs dev server at http://localhost:3000
- `npm test` – Runs tests in watch mode
- `npm run build` – Builds optimized production bundle
- `npm run eject` – Ejects Create React App config (one-way operation)

---

## Environment Variables

Create a `.env` file in the root directory:

REACT_APP_API_URL=http://localhost:5000

text

**Important:**
- Never commit `.env` to Git.
- Add `.env` to `.gitignore`.
- On Vercel, set this as an environment variable in project settings.

The frontend will use this URL to make API requests like:

fetch(${process.env.REACT_APP_API_URL}/api/auth/login, {...})
fetch(${process.env.REACT_APP_API_URL}/api/fetchtasks, {...})


---

## API Endpoints

All responses include `success: true/false` and return data or error messages.

### Auth Routes

#### POST /api/auth/signup

- Register a new user (default role: `"user"`).
- **Body:**
{
"name": "John Doe",
"email": "john@example.com",
"password": "securepassword"
}

text

- **Response (success):**
{
"success": true,
"token": "jwt_token_here",
"user": {
"_id": "user_id",
"name": "John Doe",
"email": "john@example.com",
"role": "user"
}
}


#### POST /api/auth/login

- Login and get JWT token + user info including role.
- **Body:**
{
"email": "admin@hyperverge.com",
"password": "admin123"
}


- **Response (success):**
{
"success": true,
"token": "jwt_token_here",
"user": {
"_id": "user_id",
"name": "Admin User",
"email": "admin@hyperverge.com",
"role": "admin"
}
}

---

### Task Routes (Protected)

All task endpoints require:

token: <token>

text

#### GET /api/tasks/fetchtasks

Fetches tasks based on user role:

- **User role**: Returns only that user's tasks.
- **Admin role**: Returns **all tasks from all users**.

- **Response (success):**
{
"success": true,
"tasks": [
{
"_id": "task_id",
"title": "My Task",
"description": "Task details",
"status":" status",
"priority":" priority",
"userId": "creator_user_id",
"createdAt": "2025-01-01T00:00:00.000Z"
}
]
}


#### POST /api/task/addtask

Create a new task (creator's userId is auto-assigned).

- **Body:**
{
"title": "New Task",
"description": "Task description",
"status":"your status",
"priority":"your priority"
}

text

- **Response (success):**
{
"success": true,
"task": {
"_id": "new_task_id",
"title": "New Task",
"description": "Task description",
"status":"your status",
"priority":"your priority",
"userId": "current_user_id",
"createdAt": "2025-01-01T00:00:00.000Z"
}
}

text

#### PUT /api/tasks/updatetasks/:id

Update a task (must be task creator or admin).

- **Body:**
{
"title": "Updated Title",
"description": "Updated description".
"status":"updated status",
"priority":"updated priority"
}

text

- **Response (success):**
{
"success": true,
"task": {
"_id": "task_id",
"title": "Updated Title",
"description": "Updated description",
"status":"updated status",
"priority":"updated priority",
"updatedAt": "2025-01-01T00:00:00.000Z"
}
}

text

#### DELETE /api/tasks/delettask/:id

Delete a task (must be task creator or admin).

- **Response (success):**
{
"success": true,
"message": "Task deleted successfully"
}

text

---

## Deployment

### Frontend (Vercel)

1. **Commit and push to GitHub**

git add .
git commit -m "Deploy role-based TaskManager"
git push origin main

text

2. **Deploy on Vercel**

- Go to https://vercel.com
- Click **New Project**
- Import your GitHub repository
- Set environment variable:
  - Key: `REACT_APP_API_URL`
  - Value: `https://your-role-based-backend.onrender.com`
- Click **Deploy**

Your live app will be available at:

https://role-based-task-manager.vercel.app

text

### Backend

Deploy separately on Render, Railway, or Heroku. Once deployed, get the backend URL and update the frontend's `REACT_APP_API_URL` environment variable.

---

## Testing the App

### As Admin

1. Go to login page
2. Enter:
   - Email: `admin@hyperverge.com`
   - Password: `admin123`
3. You'll see **all tasks** in the system

### As Regular User

1. Go to signup page
2. Create a new account
3. Log in with your credentials
4. You'll only see **your own tasks**

---

## Backend Repository

Backend source code and setup:  
[`role-based-TaskManager-backend`](https://github.com/vishal-singh-web/role-based-TaskManager-backend)

The backend:

- Implements JWT authentication.
- Stores users with roles (`"user"` or `"admin"`).
- Filters tasks based on the requesting user's role.
- Provides all REST endpoints for this frontend.
- Pre-seeded with admin account: `admin@hyperverge.com` / `admin123`

---

## Author

**Vishal Singh**

- GitHub: [@vishal-singh-web](https://github.com/vishal-singh-web)
- Portfolio: [vishal-singh-web.github.io](https://vishal-singh-web.github.io)

---

**Made with ❤️ by Vishal Singh**
