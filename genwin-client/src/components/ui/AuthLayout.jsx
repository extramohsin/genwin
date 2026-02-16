import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
import PageWrapper from "./PageWrapper";
import GlassCard from "./GlassCard";
import PropTypes from "prop-types";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <PageWrapper showNav={false} showFooter={false} className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md relative">
        
        {/* Decorative Blobs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-neon-pink/30 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-neon-blue/30 rounded-full blur-[80px]" />

        {/* Logo Header */}
        <div className="text-center mb-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-6 hover:scale-105 transition-transform">
            <div className="relative">
              <Heart className="text-neon-pink fill-neon-pink group-hover:animate-pulse" size={48} />
              <Sparkles className="absolute -top-2 -right-2 text-neon-yellow animate-spin-slow" size={24} />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2 font-fredoka">{title}</h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>

        {/* Auth Card */}
        <GlassCard className="relative p-6 md:p-8 backdrop-blur-3xl border-white/10 shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue" />
           {children}
        </GlassCard>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <Link to="/" className="hover:text-white transition-colors">Back to Home</Link>
        </div>
      </div>
    </PageWrapper>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default AuthLayout;
