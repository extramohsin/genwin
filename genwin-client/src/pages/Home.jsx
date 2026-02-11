import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [crush, setCrush] = useState("");
  const [like, setLike] = useState("");
  const [adore, setAdore] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Autocomplete States
  const [suggestions, setSuggestions] = useState({ crush: [], like: [], adore: [] });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Check submission status
      fetch(`http://localhost:5000/api/match/status/${parsedUser.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.submitted) {
            setIsSubmitted(true);
            navigate("/waiting-room");
          }
        })
        .catch((err) => console.error("Error checking status:", err));
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchSuggestions = async (query, field) => {
    if (!query) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/users/search?q=${query}`);
      const data = await res.json();
      setSuggestions((prev) => ({ ...prev, [field]: data.users || [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e, field, setter) => {
    const value = e.target.value;
    setter(value);
    fetchSuggestions(value, field);
  };

  const selectSuggestion = (username, field, setter) => {
    setter(username);
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crush || !like || !adore) {
        setError("Please fill in all 3 names!");
        return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/match/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, crush, like, adore }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      navigate("/waiting-room");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const AutocompleteInput = ({ label, value, setter, field, placeholder }) => (
    <div className="relative group">
      <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, field, setter)}
            placeholder={placeholder}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
      
      {suggestions[field] && suggestions[field].length > 0 && (
        <ul className="absolute z-50 w-full bg-gray-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl mt-2 max-h-60 overflow-y-auto custom-scrollbar">
          {suggestions[field].map((u) => (
            <li
              key={u.username}
              onClick={() => selectSuggestion(u.username, field, setter)}
              className="p-4 hover:bg-white/10 cursor-pointer flex items-center justify-between group transition-colors border-b border-white/5 last:border-0"
            >
              <div>
                  <span className="font-bold text-white block">@{u.username}</span>
                  <span className="text-xs text-gray-400">{u.branch} • Year {u.year}</span>
              </div>
              <span className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-pink-600/30 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
        {/* Header-less Top Bar */}
        <div className="flex justify-between items-center mb-12">
            <div>
                <h2 className="text-3xl font-bold">Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">{user.fullName.split(' ')[0]}</span> 👋</h2>
                <p className="text-gray-400 text-sm mt-1">Ready to find your match?</p>
            </div>
            <button 
                onClick={handleLogout}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors border border-white/5"
                title="Logout"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
        </div>

        {/* Action Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
            
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20 transform rotate-3">
                    <span className="text-3xl">💘</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Cast Your Votes</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                    Select your Crush, Like, and Adore. If they pick you back, it's a match!
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <AutocompleteInput 
                    label="😍 Crush (The One)" 
                    field="crush" 
                    value={crush} 
                    setter={setCrush} 
                    placeholder="Search username..." 
                />
                
                <AutocompleteInput 
                    label="😊 Person I Like" 
                    field="like" 
                    value={like} 
                    setter={setLike} 
                    placeholder="Search username..." 
                />
                
                <AutocompleteInput 
                    label="🤩 Person I Adore" 
                    field="adore" 
                    value={adore} 
                    setter={setAdore} 
                    placeholder="Search username..." 
                />

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-200"
                    >
                        🔒 Lock Choices
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        Choices are locked until reveal day. Choose wisely!
                    </p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
