import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Heart, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "./Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navLinks = token
    ? [
        { name: "Home", path: "/home" },
        { name: "Waiting Room", path: "/waiting-room" },
        { name: "Results", path: "/results" },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Sign Up", path: "/register" },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-pink-500 blur-lg opacity-50 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 font-fredoka">
              GENWIN
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                  location.pathname === link.path ? "text-pink-500" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {token && (
              <Button variant="outline" onClick={handleLogout} className="!px-4 !py-2">
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/5"
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium ${
                  location.pathname === link.path ? "text-pink-500" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {token && (
              <button
                onClick={handleLogout}
                className="w-full text-left text-base font-medium text-gray-300 hover:text-white"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
