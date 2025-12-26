# Role-Based TaskManager Backend

> Node.js/Express REST API for Role-Based TaskManager. Handles JWT authentication, role-based task filtering, and MongoDB database operations.

**Deployed on:** Render

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Role-Based Task Filtering](#role-based-task-filtering)
- [Deployment](#deployment)
- [Frontend Repository](#frontend-repository)
- [Author](#author)

---

## About

Role-Based TaskManager Backend is a **Node.js/Express REST API** that powers the [Role-Based TaskManager](https://github.com/vishal-singh-web/role-based-TaskManager) frontend.

It implements:

- **JWT-based authentication** for secure login/signup
- **Role-based access control** (User vs Admin)
- **Task filtering** based on user role
- **MongoDB Atlas** integration with Mongoose schemas
- **CORS** for cross-origin requests from the React frontend

---

## Features

✅ **Authentication**
- User registration with default role `"user"`
- Login with JWT token generation
- Password encryption with bcryptjs
- Protected routes with JWT verification middleware

✅ **Role-Based Task Management**
- Users see only their own tasks
- Admins see all tasks from all users
- Users can only edit/delete their own tasks
- Admins can edit/delete any task

✅ **Task Operations**
- Create tasks with title, description, status, and priority
- Fetch tasks (filtered by role)
- Update tasks
- Delete tasks

✅ **Pre-Seeded Admin Account**
- Email: `admin@hyperverge.com`
- Password: `admin123`
- Ready for testing and demo purposes

---

## Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB Atlas** – Cloud database
- **Mongoose** – ODM for MongoDB
- **JWT (jsonwebtoken)** – Authentication tokens
- **bcryptjs** – Password hashing
- **CORS** – Cross-origin resource sharing
- **dotenv** – Environment variable management

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm package manager
- MongoDB Atlas account (free tier available)
- Git for version control

### Installation

1. **Clone the repository**

git clone https://github.com/vishal-singh-web/role-based-TaskManager-backend.git
cd role-based-TaskManager-backend



2. **Install dependencies**

npm install



3. **Create `.env` file** in root directory

PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/rolebasedtaskmanager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000



4. **Start the server**

npm start



Server runs at:

http://localhost:5000



For development with auto-reload:

npm run dev



---

## Environment Variables

Create a `.env` file in the root directory:

PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/rolebasedtaskmanager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000



**Important:**
- Never commit `.env` to Git
- Add `.env` to `.gitignore`
- `MONGODB_URI`: Get from MongoDB Atlas connection string
- `JWT_SECRET`: Use a strong random string
- `CORS_ORIGIN`: Frontend URL (localhost for dev, Vercel URL for prod)

---

## Project Structure
```
role-based-TaskManager-backend/
├── routes/
│ ├── auth.js # Authentication routes
│ │ ├── POST /api/auth/signup
│ │ └── POST /api/auth/login
│ └── tasks.js # Task routes (role-based filtering)
│ ├── GET /api/tasks/fetchtasks
│ ├── POST /api/task/addtask
│ ├── PUT /api/tasks/updatetasks/:id
│ └── DELETE /api/tasks/delettask/:id
├── models/
│ ├── User.js # User schema
│ │ ├── name (string)
│ │ ├── email (string, unique)
│ │ ├── password (string, hashed)
│ │ └── role (string: "user" or "admin", default: "user")
│ └── Task.js # Task schema
│ ├── title (string)
│ ├── description (string)
│ ├── status (string)
│ ├── priority (string)
│ ├── userId (ObjectId, reference to User)
│ └── createdAt, updatedAt (timestamps)
├── middleware/
│ └── auth.js # JWT verification middleware
├── index.js # Server entry point
├── .env # Environment variables (not committed)
├── package.json # Dependencies & scripts
└── README.md # This file
```


---

## API Endpoints

### Base URL

http://localhost:5000



(Production: `https://your-role-based-backend.onrender.com`)

---

### Authentication Routes

#### POST /api/auth/signup

Register a new user (default role: `"user"`).

- **Body:**
{
"name": "John Doe",
"email": "john@example.com",
"password": "securepassword"
}



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



---

#### POST /api/auth/login

Login with email and password.

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

All task endpoints require JWT token in header:

token:  <token>



#### GET /api/tasks/fetchtasks

Fetch tasks based on user role.

- **Role: User** → Returns only that user's tasks
- **Role: Admin** → Returns all tasks from all users

- **Headers:**
token:  <token>



- **Response (success):**
{
"success": true,
"tasks": [
{
"_id": "task_id",
"title": "My Task",
"description": "Task details",
"status": "pending",
"priority": "high",
"userId": "creator_user_id",
"createdAt": "2025-01-01T00:00:00.000Z",
"updatedAt": "2025-01-01T00:00:00.000Z"
}
]
}



---

#### POST /api/task/addtask

Create a new task (userId auto-assigned from token).

- **Headers:**
token:  <token>



- **Body:**
{
"title": "New Task",
"description": "Task description",
"status": "pending",
"priority": "high"
}



- **Response (success):**
{
"success": true,
"task": {
"_id": "new_task_id",
"title": "New Task",
"description": "Task description",
"status": "pending",
"priority": "high",
"userId": "current_user_id",
"createdAt": "2025-01-01T00:00:00.000Z"
}
}



---

#### PUT /api/tasks/updatetasks/:id

Update a task (creator or admin only).

- **Headers:**
token:  <token>



- **Body:**
{
"title": "Updated Title",
"description": "Updated description",
"status": "completed",
"priority": "medium"
}



- **Response (success):**
{
"success": true,
"task": {
"_id": "task_id",
"title": "Updated Title",
"description": "Updated description",
"status": "completed",
"priority": "medium",
"updatedAt": "2025-01-01T00:00:00.000Z"
}
}



---

#### DELETE /api/tasks/delettask/:id

Delete a task (creator or admin only).

- **Headers:**
token:  <token>



- **Response (success):**
{
"success": true,
"message": "Task deleted successfully"
}



---

## Role-Based Task Filtering

### How It Works

1. **User makes request** to GET `/api/tasks/fetchtasks`
2. **Backend verifies JWT** and extracts userId and role
3. **Query logic:**
   - If role is `"user"` → `Task.find({ userId: req.user._id })`
   - If role is `"admin"` → `Task.find({})` (all tasks)
4. **Response** contains filtered tasks

### Example Scenarios

**Scenario 1: Regular User logs in**
- Gets all their own tasks only
- Cannot see tasks from other users
- API returns tasks where `userId === current_user._id`

**Scenario 2: Admin logs in**
- Gets all tasks from all users
- Can see who created each task (userId field)
- API returns all tasks in database

---

## Deployment on Render

1. **Push code to GitHub**

git add .
git commit -m "Initial backend commit"
git push origin main



2. **On Render:**

- Go to https://render.com
- Click **New** → **Web Service**
- Connect your GitHub repository
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- Add environment variables:
  - `MONGODB_URI` (your Atlas connection string)
  - `JWT_SECRET` (strong random string)
  - `CORS_ORIGIN` (your Vercel frontend URL)
  - `NODE_ENV` = `production`
- Click **Create Web Service**

3. **Get your backend URL**, e.g.:

https://role-based-taskmanager-backend.onrender.com



4. **Update frontend `.env`** on Vercel:

REACT_APP_API_URL=https://role-based-taskmanager-backend.onrender.com


---

## Testing with curl

### Sign Up

curl -X POST http://localhost:5000/api/auth/signup
-H "Content-Type: application/json"
-d '{
"name": "Test User",
"email": "test@example.com",
"password": "testpass123"
}'



### Login (Admin)

curl -X POST http://localhost:5000/api/auth/login
-H "Content-Type: application/json"
-d '{
"email": "admin@hyperverge.com",
"password": "admin123"
}'



### Fetch Tasks (with token)

curl -X GET http://localhost:5000/api/tasks/fetchtasks
-H "token:  YOUR_TOKEN_HERE"



### Create Task (with token)

curl -X POST http://localhost:5000/api/task/addtask
-H "token:  YOUR_TOKEN_HERE"
-H "Content-Type: application/json"
-d '{
"title": "My Task",
"description": "Task details",
"status": "pending",
"priority": "high"
}'


---

## Frontend Repository

**Role-Based TaskManager Frontend:**  
[github.com/vishal-singh-web/role-based-TaskManager](https://github.com/vishal-singh-web/role-based-TaskManager)

---

## Author

**Vishal Singh**

- GitHub: [@vishal-singh-web](https://github.com/vishal-singh-web)
- LinkedIn: [linkedin.com/in/vishal-singh-web](https://linkedin.com/in/vishal-singh-web)

---

**Made with ❤️ by Vishal Singh**
