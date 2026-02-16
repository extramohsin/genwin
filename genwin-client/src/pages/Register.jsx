import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Check, School, Calendar, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { AuthLayout, Input, Button } from "../components/ui";
import API_URL from "../config";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    branch: "",
    year: "",
    password: "",
    confirmPassword: ""
  });

  const branches = ["CSE", "AIDS", "ETC", "Electrical", "Mech", "Civil"];
  const years = ["1", "2", "3", "4"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          branch: formData.branch,
          year: formData.year,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("Account created successfully! 🎉");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Join Genwin" 
      subtitle="Find your campus match today"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <Input
          label="Full Name"
          name="fullName"
          placeholder="Ex: John Doe"
          value={formData.fullName}
          onChange={handleChange}
          icon={User}
          required
        />

        <Input
          label="Email ID"
          type="email"
          name="email"
          placeholder="student@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-400 ml-1 mb-1">
              Branch <span className="text-neon-pink">*</span>
            </label>
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-neon-pink/50 focus:ring-1 focus:ring-neon-pink/50 appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-dark-900 text-gray-500">Select Branch</option>
                {branches.map(b => (
                  <option key={b} value={b} className="bg-dark-900">{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-400 ml-1 mb-1">
              Year <span className="text-neon-pink">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-neon-pink/50 focus:ring-1 focus:ring-neon-pink/50 appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-dark-900 text-gray-500">Select Year</option>
                {years.map(y => (
                  <option key={y} value={y} className="bg-dark-900">{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

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

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={Lock}
          required
        />
        
        <div className="bg-neon-blue/10 border border-neon-blue/20 p-3 rounded-xl flex items-start gap-3 mt-2">
           <Check size={16} className="text-neon-blue mt-1 shrink-0" />
           <p className="text-xs text-neon-blue font-medium leading-tight">
             I confirm I am a student of this campus.
           </p>
        </div>

        <Button 
           type="submit" 
           variant="primary" 
           className="w-full shadow-xl shadow-neon-pink/20 mt-2" 
           isLoading={loading}
           icon={ArrowRight}
        >
          Create Account
        </Button>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-neon-pink font-bold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
