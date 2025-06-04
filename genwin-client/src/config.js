const API_URL =
  import.meta.env.NODE_ENV === "production"
    ? "https://your-backend-url.onrender.com"
    : "http://localhost:5000";

export default API_URL;
