// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";

const Input = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  className = "", 
  error, 
  success,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 ml-1 mb-1">
          {label} {props.required && <span className="text-neon-pink">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused || value ? "text-neon-pink" : "text-gray-500"}`}>
            <Icon size={18} />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full bg-white/[0.05] border 
            ${error ? "border-red-500/50 focus:border-red-500" : success ? "border-green-500/50 focus:border-green-500" : "border-white/10 focus:border-neon-pink/50"}
            rounded-xl py-3.5 ${Icon ? "pl-11" : "pl-4"} pr-4
            text-white placeholder-gray-600
            focus:outline-none focus:ring-1 
            ${error ? "focus:ring-red-500/50" : success ? "focus:ring-green-500/50" : "focus:ring-neon-pink/50"}
            transition-all duration-300
          `}
          {...props}
        />

        {/* Status Indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {error && <AlertCircle className="text-red-500" size={18} />}
          {success && <CheckCircle2 className="text-green-500" size={18} />}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 ml-1 font-medium flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.bool,
  required: PropTypes.bool,
};

export default Input;
