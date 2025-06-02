import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* 🔥 Stylish Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-6 text-center shadow-md">
        <h1 className="text-4xl font-extrabold text-white tracking-widest drop-shadow-lg">
          💖 Genwin - Find Your Match 💖
        </h1>
      </div>

      {/* 💡 Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg p-4 rounded-b-2xl">
        <div className="container mx-auto flex justify-between items-center">
          {/* 🔥 Brand Name */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-indigo-600 tracking-widest">
              Genwin
            </span>
            <span className="text-pink-500 text-xl animate-pulse">💞</span>
          </Link>

          {/* 💻 Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            <NavButton to="/Home" label="Home" />
            <NavButton to="/waiting-room" label="Waiting Room" />
            <NavButton to="/results" label="Results" />
            <NavButton to="/login" label="Login" />
            <NavButton to="/register" label="Register" />
          </div>

          {/* 📱 Mobile Menu Button */}
          <button
            className="md:hidden text-indigo-600 text-3xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✔" : "🤷‍♀️"}
          </button>
        </div>

        {/* 📱 Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center gap-3 mt-4 p-4 bg-white/90 backdrop-blur-md shadow-md rounded-lg">
            <NavButton to="/Home" label="Home" />
            <NavButton to="/waiting-room" label="Waiting Room" />
            <NavButton to="/results" label="Results" />
            <NavButton to="/login" label="Login" />
            <NavButton to="/register" label="Register" />
          </div>
        )}
      </nav>
    </header>
  );
};

// 🔘 Stylish Button Component
const NavButton = ({ to, label }) => (
  <Link
    to={to}
    className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg 
              hover:scale-105 hover:shadow-lg transition-all duration-300"
  >
    {label}
  </Link>
);

export default Navbar;
