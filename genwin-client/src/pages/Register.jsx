import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User, Mail, Lock, BookOpen, Calendar, Rocket, AtSign } from "lucide-react";
import toast from "react-hot-toast";
import API_URL from "../config";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GlassCard from "../components/ui/GlassCard";
import PageWrapper from "../components/ui/PageWrapper";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created! Please login. 🚀", { id: loadingToast });
      navigate("/login");
    } catch (error) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <PageWrapper className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <GlassCard className="relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
            <motion.div
              className="h-full bg-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-white font-fredoka">Create Account</h2>
             <p className="text-gray-400 text-sm mt-1">
              {step === 1 ? "Personal Details" : step === 2 ? "Academic Info" : "Security"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={step}>
              {step === 1 && (
                <motion.div
                  key={1}
                  custom={step}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Input
                    label="Full Name"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={User}
                    required
                  />
                  <Input
                    label="Username"
                    name="username"
                    placeholder="john_doe"
                    value={formData.username}
                    onChange={handleChange}
                    icon={AtSign}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                    required
                  />
                  <Button type="button" onClick={nextStep} className="w-full mt-4" icon={ChevronRight}>
                    Next Step
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key={2}
                  custom={step}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300 ml-1">Branch</label>
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BookOpen className="h-5 w-5 text-gray-400" />
                       </div>
                       <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none transition-all duration-300 hover:bg-white/10"
                        required
                      >
                        <option value="" className="bg-slate-900 text-gray-500">Select Branch</option>
                        <option value="CSE" className="bg-slate-900">Computer Science (CSE)</option>
                        <option value="IT" className="bg-slate-900">Information Technology (IT)</option>
                        <option value="ENTC" className="bg-slate-900">Electronics (ENTC)</option>
                        <option value="MECH" className="bg-slate-900">Mechanical (MECH)</option>
                        <option value="CIVIL" className="bg-slate-900">Civil Engineering</option>
                        <option value="AIDS" className="bg-slate-900">AI & DS</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300 ml-1">Year</label>
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                       </div>
                       <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none transition-all duration-300 hover:bg-white/10"
                        required
                      >
                        <option value="" className="bg-slate-900">Select Year</option>
                        <option value="FE" className="bg-slate-900">First Year (FE)</option>
                        <option value="SE" className="bg-slate-900">Second Year (SE)</option>
                        <option value="TE" className="bg-slate-900">Third Year (TE)</option>
                        <option value="BE" className="bg-slate-900">Final Year (BE)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                     <Button type="button" variant="secondary" onClick={prevStep} className="flex-1" icon={ChevronLeft}>
                        Back
                     </Button>
                     <Button type="button" onClick={nextStep} className="flex-1" icon={ChevronRight}>
                        Next
                     </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key={3}
                  custom={step}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={Lock}
                    required
                  />

                  <div className="flex gap-4 mt-6">
                     <Button type="button" variant="secondary" onClick={prevStep} className="flex-1" icon={ChevronLeft}>
                        Back
                     </Button>
                     <Button type="submit" disabled={loading} className="flex-1" icon={Rocket}>
                        {loading ? "Creating..." : "Launch"}
                     </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
             Already have an account?{" "}
             <Link to="/login" className="text-pink-400 hover:text-pink-300 font-medium hover:underline">
                Login here
             </Link>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
};

export default Register;
