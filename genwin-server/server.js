const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // Import HTTP
const { Server } = require("socket.io"); // Import Socket.io
require("dotenv").config();
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const matchRoutes = require("./routes/matchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const pollRoutes = require("./routes/pollRoutes");
const setupSocket = require("./socket/chatSocket"); // Import Socket Logic

const app = express();
const server = http.createServer(app); // Create HTTP Server

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://genwin-frontend.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize Socket Logic
setupSocket(io);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

app.use("/api/", limiter);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes); // New
app.use("/api/poll", pollRoutes); // New

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🎉 API is running successfully with Socket.io...");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
  res.status(statusCode).json({ 
    message: err.message || "Something went wrong! Please try again.",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); 
  }
};

// ✅ Start Server (Using server.listen instead of app.listen)
const startServer = async () => {
  await connectDB();
  
  // Production static files
  if (process.env.NODE_ENV === "production") {
    const path = require("path");
    app.use(express.static(path.join(__dirname, "../genwin-client/dist")));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../genwin-client/dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
};

startServer();
