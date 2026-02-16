// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Navbar from "../Navbar";
import Footer from "../Footer";

const PageWrapper = ({ children, className = "", showNav = true, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-dark-950 text-white font-inter relative overflow-x-hidden selection:bg-neon-pink selection:text-white flex flex-col">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Aurora Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-neon-pink/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[30%] bg-neon-blue/10 rounded-full blur-[100px] animate-blob" />
        
        {/* Noise Texture (Optional for extra premium feel) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Navigation */}
      {showNav && <Navbar />}

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative z-10 flex-grow container mx-auto px-4 py-24 ${className}`}
      >
        {children}
      </motion.main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

PageWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  showNav: PropTypes.bool,
  showFooter: PropTypes.bool,
};

export default PageWrapper;
