const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { authenticateToken } = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const Session = require("./models/session");
const User = require("./models/user")

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/sessions", authenticateToken, sessionRoutes);

// WebSocket setup
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Handle user joining session
  socket.on("joinSession", async ({ sessionId, userId }) => {
    try {
      console.log("Attempting to join session", { sessionId, userId });
  
      // Validate sessionId
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        console.error("Invalid sessionId");
        socket.emit("sessionError", { message: "Invalid session ID" });
        return;
      }
  
      // Validate user existence
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found", userId);
        socket.emit("sessionError", { message: "User not found" });
        return;
      }
  
      // Validate session existence
      const session = await Session.findById(sessionId).populate("users", "username");
      if (!session) {
        console.error("Session not found", sessionId);
        socket.emit("sessionError", { message: "Session not found" });
        return;
      }
  
      // Add user to session
      if (!session.users.some((u) => u._id.equals(userId))) {
        session.users.push(user);
        await session.save();
      }
  
      // Join the session room
      socket.join(sessionId);
  
      // Notify all users in the session
      io.to(sessionId).emit("userJoined", { userId: user._id, username: user.username });
  
      // Emit current users to the joining user
      socket.emit("sessionUsers", session.users);
    } catch (error) {
      console.error("Error while joining session:", error);
      socket.emit("sessionError", { message: "An error occurred while joining the session" });
    }
  });
  
  
  

  // Handle drawing events
  socket.on("drawing", ({ sessionId, drawingData }) => {
    // Broadcast drawing data to all users in the session, except the sender
    socket.to(sessionId).emit("drawing", drawingData);
  });

  // Handle user leaving the session
  socket.on("leaveSession", async ({ sessionId, userId }) => {
    try {
      const session = await Session.findById(sessionId).populate("users", "username");
      if (session) {
        // Remove user from the session's users array
        session.users = session.users.filter((user) => !user._id.equals(userId));
        await session.save();
  
        console.log(`User ${userId} left session ${sessionId}`);
  
        // Notify other users in the session
        io.to(sessionId).emit("sessionUsers", session.users); // Emit updated user list
        io.to(sessionId).emit("userLeft", { userId }); // Optional: Notify user-specific leave event
      }
    } catch (error) {
      console.error("Error removing user from session:", error);
    } finally {
      // Remove user from the session room
      socket.leave(sessionId);
    }
  });
  

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Server setup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
