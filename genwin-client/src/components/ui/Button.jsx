// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  isLoading = false, 
  icon: Icon,
  disabled,
  ...props 
}) => {
  
  const baseStyles = "relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-lg shadow-neon-pink/25 hover:shadow-neon-pink/50 hover:brightness-110 border border-transparent",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-md",
    outline: "bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-white/40",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    neon: "bg-transparent text-neon-blue border border-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:bg-neon-blue/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin mr-2" size={18} />
      ) : Icon ? (
        <Icon className="mr-2" size={18} />
      ) : null}
      
      <span className="relative z-10">{children}</span>

      {/* Shine Effect for Primary Buttons */}
      {variant === 'primary' && !disabled && !isLoading && (
        <div className="absolute inset-0 -translate-x-[150%] hover:translate-x-[150%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      )}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost", "danger", "neon"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
};

export default Button;
