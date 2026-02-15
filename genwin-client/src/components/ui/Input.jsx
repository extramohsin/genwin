import { motion } from "framer-motion";

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon, required = false, error, name }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-300 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 
            ${Icon ? "pl-10" : ""} 
            text-white placeholder-gray-500 
            focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 
            transition-all duration-300
            hover:bg-white/10
          `}
        />
      </div>
      {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
    </div>
  );
};

export default Input;
