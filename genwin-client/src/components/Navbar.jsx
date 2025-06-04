import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${
          scrolled ? "bg-white/90 backdrop-blur-lg shadow-lg" : "bg-transparent"
        } ${location.pathname === "/" ? "text-white" : "text-gray-900"}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3CAC] to-[#FFC83D]">
              Genwin
            </span>
            <span className="text-2xl animate-bounce">💝</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/home" label="Find Match" icon="💘" />
            <NavLink to="/waiting-room" label="Waiting Room" icon="⌛" />
            <NavLink to="/results" label="Results" icon="💖" />
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <NavLink to="/login" label="Login" icon="🔑" />
            <NavLink to="/register" label="Register" icon="✨" />
          </div>

          <button
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-2xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg p-4 space-y-3">
            <MobileNavLink to="/home" label="Find Match" icon="💘" />
            <MobileNavLink to="/waiting-room" label="Waiting Room" icon="⌛" />
            <MobileNavLink to="/results" label="Results" icon="💖" />
            <div className="h-px bg-gray-200 my-2"></div>
            <MobileNavLink to="/login" label="Login" icon="🔑" />
            <MobileNavLink to="/register" label="Register" icon="✨" />
          </div>
        )}
      </nav>
    </header>
  );
};

const NavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`nav-button ${
        isActive ? "ring-2 ring-white ring-offset-2 ring-offset-pink-400" : ""
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const MobileNavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`nav-button w-full justify-start ${
        isActive ? "ring-2 ring-white ring-offset-2 ring-offset-pink-400" : ""
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
