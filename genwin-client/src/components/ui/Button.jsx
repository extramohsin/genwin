import { motion } from "framer-motion";

const Button = ({ children, onClick, type = "button", variant = "primary", className = "", disabled = false, icon: Icon }) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right hover:shadow-lg hover:shadow-pink-500/25",
    secondary: "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10",
    outline: "bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </motion.button>
  );
};

export default Button;
