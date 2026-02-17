import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Loading } from "./ui"; // Assuming you have a Loading component
import API_URL from "../config";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
           headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            setIsAuthenticated(true);
        } else {
            console.warn("Token expired or invalid");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error("Session expired. Please login again.");
            setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth verification failed", err);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
      return <Loading fullScreen />; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
