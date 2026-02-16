const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Not authorized as admin" });
    }

    req.admin = decoded; // Attach admin info if needed
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid admin token" });
  }
};

module.exports = { adminAuth };
