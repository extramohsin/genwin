import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles, UserCheck, Clock } from "lucide-react";
import Button from "../components/ui/Button";
import PageWrapper from "../components/ui/PageWrapper";
import GlassCard from "../components/ui/GlassCard";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const floatingHearts = Array(15).fill(0).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
  }));

  return (
    <PageWrapper className="!pt-0 !px-0 !max-w-none">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ x: `${heart.x}vw`, y: "110vh", opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.5, 0],
              x: [`${heart.x}vw`, `${heart.x + (Math.random() * 10 - 5)}vw`],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear",
            }}
            className="absolute text-pink-500/20"
          >
            <Heart size={20 + Math.random() * 30} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center z-10 max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-block">
            <span className="py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-pink-300 flex items-center gap-2">
              <Sparkles size={16} /> The Future of College Matchmaking
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight font-fredoka"
          >
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Perfect Match</span>
            <br /> Without The Awkwardness
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Genwin calculates connections based on mutual interest. 
            Choose your Crush, Like, and Adore. If they choose you back, it's a match!
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                Login Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 relative z-10 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How Genwin Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three simple steps to find your destiny. No swiping, just genuine connections.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Choose Preferences</h3>
              <p className="text-gray-400">
                Select your Crush (Top Priority), Like (Backup), and Adore (Secret Admirer).
              </p>
            </GlassCard>

            <GlassCard className="text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-500">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Wait for Reveal</h3>
              <p className="text-gray-400">
                Enter the Waiting Room. Play games and chill while everyone submits their choices.
              </p>
            </GlassCard>

            <GlassCard className="text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
                <UserCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Get Matched!</h3>
              <p className="text-gray-400">
                On Reveal Day, check if your feelings are mutual. If yes, it's a GENWIN!
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default LandingPage;
