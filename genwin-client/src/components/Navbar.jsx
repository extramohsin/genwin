import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [location]);

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Admin Logged Out");
    navigate("/admin/login");
  };

  const navLinks = isAdminRoute 
    ? [{ name: "Dashboard", path: "/admin/dashboard" }]
    : isAuthenticated
      ? [
          { name: "Home", path: "/home" },
          { name: "Waiting Room", path: "/waiting-room" },
          { name: "Results", path: "/results" },
        ]
      : []; // No links for public users (Landing Page)

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className={`
            mx-auto max-w-4xl
            ${scrolled ? "bg-dark-950/80 border border-white/10 shadow-lg" : "bg-transparent border-transparent"} 
            backdrop-blur-xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300
          `}>
            
            {/* Logo */}
            <Link to={isAdminRoute ? "/admin/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="relative">
                {isAdminRoute ? (
                    <ShieldCheck className="text-red-500" size={24} />
                ) : (
                    <>
                        <Heart className="text-neon-pink fill-neon-pink" size={24} />
                        <Sparkles className="absolute -top-1 -right-1 text-neon-yellow animate-spin-slow" size={12} />
                    </>
                )}
              </div>
              <span className="font-bold font-fredoka text-xl tracking-tight">
                  {isAdminRoute ? "Genwin Admin" : "Genwin"}
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-sm font-medium transition-colors hover:text-neon-pink ${
                    location.pathname === link.path ? "text-neon-pink" : "text-gray-300"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div layoutId="underline" className="h-0.5 w-full bg-neon-pink rounded-full mt-0.5" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA / Mobile Toggle */}
            <div className="flex items-center gap-4">
              {isAdminRoute ? (
                  <button onClick={handleAdminLogout} className="hidden md:block px-4 py-1.5 text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/50 rounded-full hover:bg-red-500/30 transition-colors">
                    Logout
                  </button>
              ) : isAuthenticated ? (
                  <button 
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        toast.success("Logged out successfully");
                        navigate("/login");
                    }}
                    className="hidden md:block px-4 py-1.5 text-xs font-bold bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                  >
                    Logout
                  </button>
              ) : (
                  <Link to="/login" className="hidden md:block">
                    <button className="px-4 py-1.5 text-xs font-bold bg-white text-dark-950 rounded-full hover:bg-gray-100 transition-colors">
                        Login
                    </button>
                  </Link>
              )}
              
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark-950/95 backdrop-blur-3xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className="text-2xl font-bold text-white hover:text-neon-pink transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10 my-4" />
              
              {isAdminRoute ? (
                  <button onClick={handleAdminLogout} className="text-xl font-medium text-red-400 hover:text-white">Admin Logout</button>
              ) : isAuthenticated ? (
                  <button 
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        toast.success("Logged out successfully");
                        navigate("/login");
                    }}
                    className="text-xl font-medium text-gray-400 hover:text-white"
                  >
                    Logout
                  </button>
              ) : (
                  <>
                    <Link to="/login" className="text-xl font-medium text-gray-400 hover:text-white">Login</Link>
                    <Link to="/register" className="text-xl font-medium text-neon-pink">Sign Up</Link>
                  </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
