import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  axios.defaults.baseURL =
    import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          const { data } = await axios.get("/auth/validate", config);
          setUser(data);
        } catch (error) {
          localStorage.removeItem("token");
          setError(
            error.response?.data?.message ||
              "Session expired. Please login again."
          );
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setError(null);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post("/auth/signup", userData);
      setError(null);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
