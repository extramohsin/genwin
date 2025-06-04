const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const matchRoutes = require("./routes/matchRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/admin", adminRoutes); // Add this line

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🎉 API is running successfully...");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong! Please try again." });
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stops the server if DB fails
  }
};

// ✅ Start Server after DB Connection
const startServer = async () => {
  await connectDB();
  // Add this near your other imports
  const path = require("path");

  // Add cors configuration
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://genwin-frontend.onrender.com",
      ],
      credentials: true,
    })
  );

  // Add this before your routes
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../genwin-client/dist")));
  }

  // Update your port configuration
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
};

startServer();
app.use(cors({
  origin: "https://genwin-frontend.onrender.com",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
