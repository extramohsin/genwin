// ⚠️ FORCE LOCALHOST FOR DEBUGGING
// valid for local development "npm run dev"
const API_URL = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://genwin-backend-l8rz.onrender.com";

export default API_URL;
