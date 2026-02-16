import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-dark-950 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="text-neon-pink fill-neon-pink/20" size={20} />
          <span className="font-bold text-lg font-fredoka">Genwin</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-6">
          Connecting hearts on campus. The most premium matching experience.
        </p>

        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-neon-pink transition-colors">Privacy</a>
          <a href="#" className="hover:text-neon-pink transition-colors">Terms</a>
          <a href="#" className="hover:text-neon-pink transition-colors">Contact</a>
        </div>

        <p className="text-xs text-gray-700 mt-8">
          &copy; {new Date().getFullYear()} Genwin Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
