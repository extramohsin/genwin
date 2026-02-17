import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, LogIn, ArrowRight, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { AuthLayout, Input, Button } from "../components/ui"; 
import API_URL from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || data.error || "Login failed");

      const user = {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          branch: data.branch,
          year: data.year
      };

      if (!user.userId || !user.email) {
          throw new Error("Invalid response from server");
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
      
      toast.success(`Welcome back, ${user.fullName || "Student"}! 💖`);
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Login with your email"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="student@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            required
          />
          <div className="flex justify-end mt-1">
             <Link to="/forgot-password" className="text-xs text-neon-pink hover:text-white transition-colors">
               Forgot password?
             </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full shadow-lg shadow-neon-pink/20" 
          isLoading={loading}
          icon={LogIn}
        >
          Login
        </Button>

        <p className="text-center text-gray-400 mt-6 relative z-20">
          Don't have an account?{" "}
          <Link to="/register" className="text-neon-pink font-bold hover:underline inline-flex items-center gap-1">
            Sign up <ArrowRight size={14} />
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
