import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import API_URL from "../config";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GlassCard from "../components/ui/GlassCard";
import PageWrapper from "../components/ui/PageWrapper";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Verifying admin credentials...");

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("adminToken", data.token);
      toast.success("Admin Access Granted 🛡️", { id: loadingToast });
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <GlassCard className="border-red-500/20 shadow-red-500/10">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-slate-900 border border-red-500/30 mb-4 text-red-500">
               <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white">
              Admin Portal
            </h2>
            <p className="text-gray-400 mt-2">Restricted Access Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@genwin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
              {loading ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </PageWrapper>
  );
};

export default AdminLogin;
