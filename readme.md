# CrowdFunding - MERN Project

CrowdFunding is a full-stack MERN (MongoDB, Express.js, React, Node.js) application that enables users to create crowdfunding campaigns or donate to existing ones. Built with JWT-based authentication, MongoDB Atlas for data storage, and bcrypt for password encryption, it offers a secure and feature-rich experience. Key features include notifications, an admin dashboard for managing users and campaigns, donor badges based on donation levels, and detailed user profiles. Routes are protected using role-based access control and token verification, with backend activity logged to `.log` files.

## Features

- **Campaign Management**: Users can create campaigns or donate to others.
- **Authentication**: JWTs for secure login and role-based route protection.
- **Database**: MongoDB Atlas for persistent storage.
- **Notifications**: Alerts for key actions (e.g., donations, campaign updates).
- **Admin Dashboard**: Admins can manage, edit, or delete users and campaigns, and view all transactions.
- **Donor Badges**: Earn badges when total donations exceed predefined levels.
- **User Profiles**: View created campaigns, donated campaigns, donation amounts, total contributions, and reset username/password individually or together.
- **Security**: Passwords encrypted with bcrypt; protected API routes.
- **Logging**: Backend activity tracked in `.log` files.

## Project Structure

CrowdFunding/
├── frontend/ # React frontend
├── backend/ # Express/Node.js backend
├── .gitignore # Git ignore file
└── README.md # This file

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- A modern web browser (e.g., Chrome, Firefox)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SamudraDSilva/CrowdFunding.git
   cd CrowdFunding
   ```
2. **Install backend dependencies:**
   cd backend
   npm install

3. **Install frontend dependencies:**
   cd frontend
   npm install

4. **Environment Variables**
   Create a .env file in the frontend/ folder with the following:

   REACT_APP_API_URL=http://localhost:5000/api/ # Backend API base URL

   Create a .env file in the backend/ folder with the following:

   PORT=5000 # Port for the backend server (default: 5000)
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.hfgia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster # MongoDB Atlas URI
   SECRET=your-secret-key # Secret key for general use (e.g., encryption)
   REFRESH_SECRET=your-refresh-secret # Secret key for refresh tokens
   ACCESS_SECRET=your-access-secret # Secret key for access tokens

5. **Running the Project**
   Start the backend:
   cd backend
   npm run dev

   Start the frontend: In a new terminal window
   cd frontend
   npm start
