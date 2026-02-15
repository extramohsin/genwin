import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import API_URL from "../config";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GlassCard from "../components/ui/GlassCard";
import PageWrapper from "../components/ui/PageWrapper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Logging in...");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("token", data.token);
      
      const userData = {
        userId: data.userId,
        fullName: data.fullName,
        branch: data.branch,
        year: data.year
      };
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast.success("Welcome back!", { id: loadingToast });
      navigate("/home");
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <GlassCard>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Welcome Back
            </h2>
            <p className="text-gray-400 mt-2">Login to find your match</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
              <div className="flex justify-end">
                <Link to="#" className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full" icon={LogIn}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-pink-400 hover:text-pink-300 font-medium">
              Sign up free
            </Link>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
};

export default Login;
