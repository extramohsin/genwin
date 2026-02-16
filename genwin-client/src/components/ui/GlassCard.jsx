// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const GlassCard = ({ children, className = "", hoverEffect = false, ...props }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`
        relative overflow-hidden
        bg-white/[0.03] backdrop-blur-2xl 
        border border-white/10 
        rounded-2xl shadow-xl
        ${hoverEffect ? "hover:bg-white/[0.06] hover:border-white/20 hover:shadow-neon-pink/10 transition-all duration-300 group" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Glossy Reflection Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      
      {children}
    </motion.div>
  );
};

GlassCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hoverEffect: PropTypes.bool,
};

export default GlassCard;
