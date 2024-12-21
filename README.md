# Collaborative Whiteboard

A real-time collaborative whiteboard application built with React, Node.js, Socket.IO, and MongoDB.

## Features
- Real-time canvas drawing with WebSocket integration
- User authentication (JWT-based)
- Session management
- Drawing tools: color picker, erase, undo
- Dynamic user list for sessions

## Tech Stack
- **Frontend**: React, Tailwind CSS, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB
- **Authentication**: JWT

## Installation

### Prerequisites
- Node.js installed
- MongoDB installed and running locally or on a cloud service

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
2. Backend SetUp
   => Navigate to the backend folder
        cd backend
   => Install dependencies:
        npm install
   => Create a .env file with the following content:
        PORT=5000
        MONGODB_URL=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
   => Start the backend server:
        npm start
3. Frontend SetUp
   => Navigate to the frontend folder:
        cd frontend
   => Install dependencies:
        npm install
   => Start the development server:
        npm start 


