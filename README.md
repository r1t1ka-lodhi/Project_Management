📌 Project Management App

A full-stack Project Management Application built with Node.js (Express, MongoDB) for the backend and React (Vite, Tailwind) for the frontend.
It includes authentication (register, login, JWT-based sessions, logout) and basic project management features.

🚀 Features
🔐 Authentication

User registration with email verification

Secure login with JWT-based access & refresh tokens

Logout functionality with cookie clearing

Password reset & change password support

📂 Project Management

Create, update, and delete projects

Assign tasks & team members (extendable)

Dashboard to view user projects

Protected routes (only logged-in users can access projects)

🌐 Tech Stack

Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, Nodemailer

Frontend: React (Vite), TailwindCSS, Axios, React Router

Auth Flow: Access & refresh tokens stored in HTTP-only cookies

🛠️ Installation

Clone the repo:

git clone https://github.com/your-username/project-management-app.git
cd project-management-app

1️⃣ Backend Setup
cd backend
npm install


Create a .env file inside backend/ with:

PORT=5000
MONGO_URI=your_mongo_connection_string
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
MAIL_HOST=smtp.yourprovider.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password


Run the backend server:

npm run dev


Your backend will be live at:
👉 http://localhost:5000/api/v1

2️⃣ Frontend Setup
cd frontend
npm install


In src/api/axios.js, update your backend URL if needed:

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});


Run the frontend app:

npm run dev


Your frontend will be live at:
👉 http://localhost:5173

🔑 API Endpoints
Auth Routes

POST /api/v1/users/register → Register a new user

POST /api/v1/users/login → Login user

POST /api/v1/users/logout → Logout user

GET /api/v1/users/verify-email/:token → Verify email

POST /api/v1/users/forgot-password → Request password reset

POST /api/v1/users/reset-password/:token → Reset password

POST /api/v1/users/current-user → Get logged-in user details

Project Routes (example)

GET /api/v1/projects → Get all user projects

POST /api/v1/projects → Create a project

PUT /api/v1/projects/:id → Update project

DELETE /api/v1/projects/:id → Delete project

🖥️ Frontend Screens

Login Page → Authenticate user

Register Page → Create new account

Dashboard → List of projects for logged-in user

Project Detail Page → View project-specific tasks (extendable to Kanban board)

📦 Scripts
Backend
npm run dev   # Run server with nodemon
npm start     # Run production server

Frontend
npm run dev   # Run development server
npm run build # Build for production
npm run preview # Preview production build

🤝 Contributing

Fork the repo

Create a new branch (feature/awesome-feature)

Commit changes

Push to your fork and create a Pull Request

📜 License

This project is licensed under the MIT License.
