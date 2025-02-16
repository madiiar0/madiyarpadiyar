# MERN Project

## Project Description
A full-stack web application built using the **MERN** stack (**MongoDB, Express.js, React.js, Node.js**). This project provides user authentication, mental health assessments, and treatment tracking through an interactive web interface.

## Features
- User Authentication (Signup/Login with hashed passwords)
- RESTful API with Express.js and MongoDB
- Secure backend with JWT-based authentication
- Mental health assessment tracking
- Treatment management with history
- Responsive frontend using React
- State management with Context API (or Redux if needed)
- CRUD operations for users, assessments, and treatments
- Secure backend with environment variables

## Technologies Used
- **Frontend:** React.js, React Router, Context API, Tailwind CSS / Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ORM)
- **Authentication:** JSON Web Token (JWT) & bcrypt
- **API Testing:** Postman / Thunder Client

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB

### Backend Setup
```bash
cd backend
npm install
```
Run the backend server:
```bash
node index.js
```

### Frontend Setup
```bash
cd faceend
npm install
npm run  dev
```

## Required Packages
### Backend
```bash
npm install express mongoose dotenv cors bcrypt jsonwebtoken
```
- **express**: Backend framework for handling routes and middleware.
- **mongoose**: ODM for MongoDB.
- **dotenv**: Manage environment variables.
- **cors**: Enable CORS for frontend-backend communication.
- **bcrypt**: Hash passwords for security.
- **jsonwebtoken**: Manage authentication using JWT.

### Frontend
```bash
npm install react-router-dom axios @mui/material @emotion/react @emotion/styled
```
- **react-router-dom**: Routing for React applications.
- **axios**: Make HTTP requests to the backend.
- **@mui/material, @emotion/react, @emotion/styled**: UI components for styling and layout.



