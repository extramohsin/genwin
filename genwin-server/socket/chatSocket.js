const jwt = require("jsonwebtoken");
const filter = require("leo-profanity");
const ChatMessage = require("../models/ChatMessage");

// filter.loadDictionary(); // Load default dictionary (optional if defaults are good)

const userCooldowns = new Map(); // userId -> timestamp

const setupSocket = (io) => {
  // Middleware: Authenticate Socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, ... } matches user object structure
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Join Room (Global Room for simplicity)
    socket.join("waiting-room");

    // Handle Send Message
    socket.on("send_message", async (data) => {
      const { message, anonName, replyTo } = data;
      const userId = socket.user.id;

      // 1. Validation
      if (!message || message.trim().length === 0) return;
      if (message.length > 200) {
          socket.emit("error", { message: "Message too long (max 200 chars)" });
          return;
      }

      // 2. Cooldown Check (5 seconds)
      const lastMsgTime = userCooldowns.get(userId) || 0;
      const now = Date.now();
      if (now - lastMsgTime < 5000) {
        socket.emit("error", { message: "Slow down! Wait 5 seconds." });
        return;
      }
      userCooldowns.set(userId, now);

      // 3. Profanity Filter
      let cleanMessage = message;
      try {
          if (filter.check(message)) {
              cleanMessage = filter.clean(message);
          }
      } catch (e) {
          // ignore filter errors
      }

      // 4. Save to DB
      try {
        const newMsg = await ChatMessage.create({
          userId,
          anonName: anonName || "Anonymous",
          message: cleanMessage,
          replyTo: replyTo || null
        });
        
        // Populate replyTo if needed, or just send raw for now
        // For efficiency, we just send what we have. 
        // Frontend can handle linking if it has the history.
        
        // 5. Broadcast
        io.to("waiting-room").emit("receive_message", newMsg);

      } catch (err) {
        console.error("Save Msg Error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      // Cleanup cooldowns to prevent memory leaks
      if (socket.user && socket.user.id) {
          userCooldowns.delete(socket.user.id);
      }
      console.log(`User disconnected: ${socket.user?.id}`);
    });
  });
};

module.exports = setupSocket;
