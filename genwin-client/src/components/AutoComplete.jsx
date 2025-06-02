import { useState, useEffect, useRef } from 'react';

const AutoComplete = ({ value, onChange, placeholder, excludeValues = [] }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/match/suggestions?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      // Filter out already selected names
      const filteredSuggestions = data.filter(user => !excludeValues.includes(user.fullName));
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.fullName);
    onChange(suggestion.fullName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion._id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-pink-50 cursor-pointer flex justify-between items-center"
            >
              <span>{suggestion.fullName}</span>
              <span className="text-sm text-gray-500">{suggestion.branch} - {suggestion.year} Year</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;