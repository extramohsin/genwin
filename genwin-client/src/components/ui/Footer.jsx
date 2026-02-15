import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Genwin. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
          <span>for students</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
