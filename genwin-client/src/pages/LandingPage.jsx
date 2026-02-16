import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Zap, Star } from "lucide-react";
import PageWrapper from "../components/ui/PageWrapper";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";

const LandingPage = () => {
  return (
    <PageWrapper showNav={true} showFooter={true}>
      
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-4 animate-fade-in-up">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-pink"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">The #1 Campus Matchmaker</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black font-fredoka tracking-tight leading-none">
            Find Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue animate-glow">
              Campus Crush
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            The most premium, secure, and exciting way to find your match this semester. 
            No more guessing games—just pure destiny.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight} className="rounded-full px-12">
                Start Matching
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="rounded-full px-12">
                Login Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { label: "Students", value: "2,000+" },
            { label: "Matches", value: "850+" },
            { label: "Campuses", value: "12" },
            { label: "Success Rate", value: "94%" },
          ].map((stat, i) => (
            <GlassCard key={i} className="text-center py-8">
              <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider mt-2">{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Genwin?</h2>
          <p className="text-gray-400">Built for privacy, designed for love.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard 
            icon={Shield} 
            title="100% Anonymous" 
            desc="Your choices are encrypted and never revealed unless it's a match." 
            color="text-neon-blue"
          />
          <FeatureCard 
            icon={Zap} 
            title="Instant Results" 
            desc="Our algorithm matches you in milliseconds on reveal day." 
            color="text-neon-yellow"
          />
          <FeatureCard 
            icon={Heart} 
            title="Verified Users" 
            desc="Only real students from your campus. No bots, no fakes." 
            color="text-neon-pink"
          />
        </div>
      </section>

    </PageWrapper>
  );
};

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <GlassCard hoverEffect className="p-8 group cursor-default">
    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${color}`}>
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </GlassCard>
);

export default LandingPage;
