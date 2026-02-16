import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, Star, Sparkles, Lock, LogOut } from "lucide-react";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// Import from index to ensure cleaner imports
import { PageWrapper, GlassCard, Button, Input, Loading } from "../components/ui"; 
import API_URL from "../config";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Form States
  // formData stores the IDs for submission
  const [formData, setFormData] = useState({
    crushId: "",
    likeId: "",
    adoreId: ""
  });
  
  // displayValues stores the text to show (Names)
  const [displayValues, setDisplayValues] = useState({
    crush: "",
    like: "",
    adore: ""
  });

  // Autocomplete States
  const [suggestions, setSuggestions] = useState({ crush: [], like: [], adore: [] });
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    // Safe JSON Parse
    const storedUserStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUserStr || !token) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUserStr);
      setUser(parsedUser);

      // Verify match status using NEW ENDPOINT (No userId needed)
      fetch(`${API_URL}/api/match/status`, {
         headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
          if (data.hasSubmitted) {
             navigate("/waiting-room");
          }
          setPageLoading(false);
      })
      .catch(err => {
          console.error("Auth Error", err);
          // If 401, maybe logout? For now just load page
          setPageLoading(false);
      });

    } catch (e) {
      console.error("Parse Error", e);
      localStorage.removeItem("user"); // Clear bad data
      navigate("/login");
    }
  }, [navigate]);

  const fetchSuggestions = async (query, field) => {
    if (!query || query.length < 2) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/search?q=${query}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSuggestions((prev) => ({ ...prev, [field]: data.users || [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    
    // Update Display Value
    setDisplayValues(prev => ({ ...prev, [field]: value }));
    
    // Clear the ID because user is typing/editing
    const idField = field + "Id";
    setFormData(prev => ({ ...prev, [idField]: "" }));

    setActiveField(field);
    fetchSuggestions(value, field);
  };

  const selectSuggestion = (userObj, field) => {
    // Set Display to Name
    setDisplayValues(prev => ({ ...prev, [field]: userObj.fullName }));
    
    // Set ID for submission
    const idField = field + "Id";
    setFormData(prev => ({ ...prev, [idField]: userObj._id }));

    setSuggestions(prev => ({ ...prev, [field]: [] }));
    setActiveField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.crushId || !formData.likeId || !formData.adoreId) {
      toast.error("You must fill all 3 slots! 🥲");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/match/submit`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          crushId: formData.crushId, 
          likeId: formData.likeId, 
          adoreId: formData.adoreId 
        }),
      });

      const data = await res.json();
      
      if (res.status === 409) {
          toast.error("You have already submitted! Redirecting...");
          navigate("/waiting-room");
          return;
      }

      if (!res.ok) throw new Error(data.message || "Submission failed");

      toast.success("Locked in! Fingers crossed 🤞");
      navigate("/waiting-room");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (pageLoading || !user) return <Loading fullScreen />;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold font-fredoka mb-2">
            Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-neon-purple">{user?.fullName?.split(' ')[0] || "Student"}</span> 👋
          </h1>
          <p className="text-gray-400">Match Day is approaching. Make your selection.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} icon={LogOut}>
          Logout
        </Button>
      </div>

      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="relative z-10">
          
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Card 1: Crush */}
            <MatchCard 
              title="Your Crush" 
              subtitle="The one you dream about 😍"
              icon={Heart}
              color="bg-neon-pink"
              borderColor="border-neon-pink"
              glowColor="shadow-neon-pink/20"
            >
               <AutocompleteInput 
                 field="crush"
                 value={displayValues.crush}
                 onChange={(e) => handleInputChange(e, "crush")}
                 suggestions={suggestions.crush}
                 onSelect={(u) => selectSuggestion(u, "crush")}
                 placeholder="Search by name..."
                 isActive={activeField === "crush"}
               />
            </MatchCard>

            {/* Card 2: Like */}
            <MatchCard 
              title="Person You Like" 
              subtitle="Someone expecting a connection 😉"
              icon={Star}
              color="bg-neon-yellow"
              borderColor="border-neon-yellow"
              glowColor="shadow-neon-yellow/20"
            >
               <AutocompleteInput 
                 field="like"
                 value={displayValues.like}
                 onChange={(e) => handleInputChange(e, "like")}
                 suggestions={suggestions.like}
                 onSelect={(u) => selectSuggestion(u, "like")}
                 placeholder="Search by name..."
                 isActive={activeField === "like"}
               />
            </MatchCard>

            {/* Card 3: Adore */}
            <MatchCard 
              title="Person You Adore" 
              subtitle="A secret admirer perhaps? ✨"
              icon={Sparkles}
              color="bg-neon-purple"
              borderColor="border-neon-purple"
              glowColor="shadow-neon-purple/20"
            >
               <AutocompleteInput 
                 field="adore"
                 value={displayValues.adore}
                 onChange={(e) => handleInputChange(e, "adore")}
                 suggestions={suggestions.adore}
                 onSelect={(u) => selectSuggestion(u, "adore")}
                 placeholder="Search by name..."
                 isActive={activeField === "adore"}
               />
            </MatchCard>

          </div>

          <div className="flex flex-col items-center justify-center pt-12 space-y-4">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              isLoading={loading}
              className="w-full md:w-auto min-w-[320px] shadow-2xl shadow-neon-pink/30 hover:shadow-neon-pink/50 scale-110"
              icon={Lock}
            >
              Lock In My Choices
            </Button>
            <p className="text-gray-500 text-sm">
              Note: Selections are final once submitted.
            </p>
          </div>

        </form>
      </div>
    </PageWrapper>
  );
};

// --- Sub Components ---

// eslint-disable-next-line no-unused-vars
const MatchCard = ({ title, subtitle, icon: Icon, color, borderColor, glowColor, children }) => (
  <GlassCard 
    className={`relative overflow-visible border-t-4 ${borderColor} ${glowColor} shadow-lg h-full flex flex-col p-6 md:p-8`}
  >
    <div className={`w-14 h-14 rounded-full ${color}/20 flex items-center justify-center mb-6`}>
      <Icon size={28} className={color.replace("bg-", "text-")} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-2 font-fredoka">{title}</h3>
    <p className="text-sm text-gray-400 mb-8">{subtitle}</p>
    <div className="mt-auto">
      {children}
    </div>
  </GlassCard>
);

MatchCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  color: PropTypes.string,
  borderColor: PropTypes.string,
  glowColor: PropTypes.string,
  children: PropTypes.node,
};

const AutocompleteInput = ({ value, onChange, suggestions, onSelect, placeholder, isActive }) => (
  <div className="relative group">
    <Input 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="!mb-0"
      icon={Search}
    />
    
    <AnimatePresence>
      {isActive && suggestions.length > 0 && (
        <motion.ul 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute z-50 w-full left-0 mt-3 bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar ring-1 ring-white/10"
        >
          {suggestions.map((u) => (
            <li
              key={u._id}
              onClick={() => onSelect(u)}
              className="p-4 hover:bg-white/10 cursor-pointer flex items-center justify-between group border-b border-white/5 last:border-0 transition-colors"
            >
              <div>
                <span className="font-bold text-white block text-sm">{u.fullName}</span>
                <span className="text-xs text-gray-400">{u.branch}</span>
              </div>
              <Sparkles size={14} className="text-neon-pink opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  </div>
);

AutocompleteInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  suggestions: PropTypes.array,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  isActive: PropTypes.bool,
};

export default Home;
