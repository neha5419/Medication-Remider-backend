◼Medication Reminder App - Backend
Overview
This is the backend for the Medication Reminder App, built using Node.js, Express.js, and Prisma ORM with a Neon PostgreSQL database. The backend exposes REST APIs for user authentication, medicine schedules, and acknowledgment logs.

◼Architecture
The project follows a modular architecture to maintain simplicity and scalability:

◾routes: All route logic is centralized in this folder.
◾prisma: Prisma ORM manages the database schema and interactions.
◾server.js: Entry point to start the backend server.
◾.env: Contains environment variables like database connection URLs and JWT secrets.


◼Tech Stack
◾Node.js
◾Express.js
◾Prisma ORM
◾Neon PostgreSQL
◾JWT for authentication


◼Prerequisites
Before running the project locally, ensure you have the following installed:

◾Node.js (v16 or higher)
◾PostgreSQL (local or remote instance)
◾Prisma CLI


◼Installation and Setup

◾git clone <repository-url>
◾cd medication-reminder-backend
◾npm install

◼Set Environment Variable
◾DATABASE_URL="postgresql://neondb_owner:KD1ybATil6xd@ep-jolly-bird-a56lgxst.us-east-2.aws.neon.tech/MediFor7?sslmode=require"
◾JWT_SECRET="0123456789"
◾PORT=3000

◼Run Prisma Migrations
◾npx prisma migrate dev --name init

◼Start the server
◾npm start


◼Folder Structure

medication-reminder-backend/
│
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
│
├── routes/                 # Route logic
│   ├── authRoutes.js             # Login/Register routes
│   ├── scheduleRoutes.js         # Medicine schedule routes
│   └── acknowledgmentRoutes.js   # Logs and acknowledgment routes
│
├── .env                    # Environment variables
├── index.js               # Server entry point
└── package.json            # Dependencies and scripts
