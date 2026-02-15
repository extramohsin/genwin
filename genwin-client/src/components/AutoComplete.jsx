import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import API_URL from "../config";

const AutoComplete = ({ label, onSelect, placeholder, icon: Icon, excludedUserId }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      console.log("AutoComplete: Fetching for", query); // DEBUG
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        let url = `${API_URL}/api/match/search?query=${query}`;
        if (excludedUserId) {
            url += `&excludedUserId=${excludedUserId}`;
        }
        
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("AutoComplete: Suggestions", data); // DEBUG
        setSuggestions(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (user) => {
    setSelectedItem(user);
    setQuery(user.fullName); // Show full name in input
    onSelect(user); // Pass full user object to parent
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setQuery("");
    onSelect(null);
  };

  return (
    <div className="space-y-1 relative" ref={wrapperRef}>
      {label && <label className="block text-sm font-medium text-gray-300 ml-1">{label}</label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon ? <Icon className="h-5 w-5 text-gray-400" /> : <Search className="h-5 w-5 text-gray-400" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedItem(null); // Reset selection on edit
          }}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white/10"
        />
        {selectedItem && (
             <button 
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
             >
                 ✕
             </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-60 overflow-auto"
          >
            {suggestions.map((user) => (
              <div
                key={user._id}
                onClick={() => handleSelect(user)}
                className="px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-none"
              >
                <div className="font-medium text-white">{user.fullName}</div>
                <div className="text-xs text-gray-400">
                   @{user.username} • {user.branch} • Year {user.year}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoComplete;
