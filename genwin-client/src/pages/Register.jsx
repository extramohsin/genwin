import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password, branch, year }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Server error, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
       {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black"></div>
      </div>

      <div className="z-10 bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          Join Genwin
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Username (e.g. alice)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
                <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors appearance-none cursor-pointer"
                    required
                >
                    <option value="" className="bg-gray-800">Branch</option>
                    <option value="ETC" className="bg-gray-800">ETC</option>
                    <option value="CSE" className="bg-gray-800">CSE</option>
                    <option value="MECH" className="bg-gray-800">MECH</option>
                    <option value="AIDS" className="bg-gray-800">AI & DS</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
            </div>
            
            <div className="relative">
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors appearance-none cursor-pointer"
                    required
                >
                    <option value="" className="bg-gray-800">Year</option>
                    <option value="1" className="bg-gray-800">1st Year</option>
                    <option value="2" className="bg-gray-800">2nd Year</option>
                    <option value="3" className="bg-gray-800">3rd Year</option>
                    <option value="4" className="bg-gray-800">4th Year</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                     <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-pink-500/25 transform hover:-translate-y-1 transition-all"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
