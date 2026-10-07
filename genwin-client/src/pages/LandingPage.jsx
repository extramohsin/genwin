import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Heart, Lock, Clock, MessageSquare,
  Gamepad2, BarChart2, Sparkles, Eye, EyeOff, Shuffle, Star
} from "lucide-react";
import PageWrapper from "../components/ui/PageWrapper";
import Button from "../components/ui/Button";

// ── Floating particle (hidden on narrow screens to prevent text overlap) ──────
const FloatingEmoji = ({ emoji, style, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: [0, 1, 0.7, 1], y: [20, -10, 5, -5] }}
    transition={{ delay, duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    className="absolute text-xl sm:text-2xl select-none pointer-events-none hidden sm:block"
    style={style}
  >
    {emoji}
  </motion.span>
);

// ── Bento card wrapper ─────────────────────────────────────────────────────
const BentoCard = ({ children, className = "", glowColor = "rgba(236,72,153,0.15)" }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, ease: "easeOut" }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl group ${className}`}
    style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 20px 50px -12px rgba(0,0,0,0.6)` }}
  >
    {/* Hover glow */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl"
      style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)` }}
    />
    {/* Top shine line */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    {children}
  </motion.div>
);

// ── Step pill ──────────────────────────────────────────────────────────────
const StepPill = ({ number, icon, color, bg, border, title, desc, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="flex items-start gap-4 sm:gap-5 group"
  >
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center ${color} ${bg} ${border} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <span className="text-[9px] sm:text-[10px] font-black text-white/20 tracking-widest">{number}</span>
    </div>
    <div className="pt-0.5 sm:pt-1">
      <h3 className="text-white font-bold text-sm sm:text-base mb-1 sm:mb-1.5 font-fredoka">{title}</h3>
      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

// ── Main ───────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <PageWrapper showNav={true} showFooter={true}>

      {/* ════════════════════════════════════════════════════════ HERO ══ */}
      <section ref={heroRef} className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 py-8 sm:py-16">

        {/* Floating emojis (visible on tablet/desktop) */}
        <FloatingEmoji emoji="💌" style={{ top: "12%", left: "8%" }} delay={0} />
        <FloatingEmoji emoji="✨" style={{ top: "20%", right: "10%" }} delay={0.8} />
        <FloatingEmoji emoji="🌸" style={{ bottom: "25%", left: "6%" }} delay={1.4} />
        <FloatingEmoji emoji="💫" style={{ bottom: "20%", right: "8%" }} delay={0.4} />
        <FloatingEmoji emoji="🔮" style={{ top: "55%", left: "14%" }} delay={1.8} />
        <FloatingEmoji emoji="💘" style={{ top: "40%", right: "5%" }} delay={1.1} />

        {/* Central glow orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[320px] sm:w-[500px] md:w-[700px] h-[320px] sm:h-[500px] md:h-[700px] bg-neon-pink/10 rounded-full blur-[120px] sm:blur-[180px]" />
          <div className="absolute w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-neon-purple/15 rounded-full blur-[80px] sm:blur-[120px]" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 sm:mb-8 max-w-[92vw]"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-pink" />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-gray-300 tracking-wide text-left sm:text-center leading-tight">
              Campus matchmaking · Blind · Anonymous · Mutual only
            </span>
          </motion.div>

          {/* Hero headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black font-fredoka tracking-tight leading-[1.05] sm:leading-[0.95] mb-5 sm:mb-6"
          >
            <span className="text-white">Find Your</span>
            <br />
            <span className="relative inline-block mt-1 sm:mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue">
                Campus Crush
              </span>
              {/* Underline glow */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-1 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue rounded-full opacity-60"
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2"
          >
            You get <span className="text-white font-semibold">3 secret names</span> from your campus.
            You pick anonymously. They pick anonymously.
            On <span className="text-neon-pink font-semibold">Reveal Day</span> — only mutual matches unlock. No cringe. Just destiny.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button size="lg" variant="primary" icon={ArrowRight}
                  className="w-full sm:w-auto rounded-full px-8 sm:px-10 shadow-[0_0_30px_rgba(236,72,153,0.4)] text-base font-bold py-3.5 sm:py-3">
                  Join the Reveal
                </Button>
              </motion.div>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-full px-8 sm:px-10 text-base py-3.5 sm:py-3">
                  Already In? Login
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust micro-text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-[10px] sm:text-xs text-gray-500 mt-6 sm:mt-8 tracking-wider px-2 text-center"
          >
            Free · No social logins · No DMs · Campus-only · Your picks stay private forever
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 text-white/20"
        >
          <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════ HOW IT WORKS (timeline) ══ */}
      <section className="py-14 sm:py-20 md:py-28 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Section label */}
          <div className="flex flex-col md:flex-row gap-10 sm:gap-16 items-start">
            {/* Left: sticky label */}
            <div className="md:sticky md:top-28 md:w-72 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6">
                  <Sparkles size={10} /> The Journey
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-fredoka text-white leading-tight mb-3 sm:mb-4">
                  How the magic{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-neon-pink to-neon-purple">
                    unfolds
                  </span>
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Four steps. Zero awkwardness. One reveal day that changes everything.
                </p>
              </motion.div>
            </div>

            {/* Right: steps with connector line */}
            <div className="flex-1 relative w-full">
              {/* Vertical connector */}
              <div className="absolute left-5 sm:left-6 top-6 bottom-6 w-px bg-gradient-to-b from-neon-purple/40 via-neon-pink/30 to-transparent hidden sm:block" />

              <div className="space-y-8 sm:space-y-12 relative">
                <StepPill
                  number="01" delay={0}
                  icon={<Shuffle size={20} />}
                  color="text-neon-purple" bg="bg-neon-purple/10" border="border border-neon-purple/20"
                  title="You get 3 secret names"
                  desc="When you register, the system secretly assigns you 3 potential matches from your campus. You won't know who they are yet — just 3 slots waiting to be revealed."
                />
                <StepPill
                  number="02" delay={0.1}
                  icon={<EyeOff size={20} />}
                  color="text-neon-pink" bg="bg-neon-pink/10" border="border border-neon-pink/20"
                  title="You choose, completely blind"
                  desc="From those 3 names, you make your choice — anonymously. They do the same on their end. Nobody sees anybody's pick. No pressure, no fear of rejection."
                />
                <StepPill
                  number="03" delay={0.2}
                  icon={<Clock size={20} />}
                  color="text-cyan-400" bg="bg-cyan-400/10" border="border border-cyan-400/20"
                  title="Wait in the vibe room"
                  desc="Until Reveal Day, you're in the Waiting Lobby — chat anonymously, play mini-games, vote on polls with your whole campus. It's genuinely fun."
                />
                <StepPill
                  number="04" delay={0.3}
                  icon={<Eye size={20} />}
                  color="text-green-400" bg="bg-green-400/10" border="border border-green-400/20"
                  title="Only mutual matches reveal"
                  desc="On the big day, you see a name only if they also chose you. If they didn't? You never find out, and neither do they. Zero embarrassment. Pure magic when it works."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ BENTO FEATURES ══ */}
      <section className="py-12 sm:py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-5"
            >
              <Heart size={10} fill="currentColor" /> While You Wait
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black font-fredoka text-white"
            >
              Way more than just{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">
                waiting
              </span>
            </motion.h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 sm:gap-4">

            {/* Large card — Anonymous Chat */}
            <BentoCard className="md:col-span-4 p-5 sm:p-8 md:p-10" glowColor="rgba(236,72,153,0.2)">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 border border-neon-pink/20 flex items-center justify-center text-neon-pink group-hover:scale-110 transition-transform">
                    <MessageSquare size={28} className="sm:w-9 sm:h-9" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Live Right Now</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-fredoka text-white mb-2 sm:mb-3">
                    Anonymous Chat Room
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                    Connect with everyone on campus under a random alias like <span className="text-white font-mono text-xs sm:text-sm bg-white/5 px-2 py-0.5 rounded-md">@NeonFox #342</span>. 
                    Drop hot takes, whisper to specific people, share vibes. No identity required — ever.
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Tall card — Anonymous */}
            <BentoCard className="md:col-span-2 p-5 sm:p-7 md:p-8 flex flex-col justify-between" glowColor="rgba(59,130,246,0.2)">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Lock size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black font-fredoka text-white mb-2 sm:mb-3">Fully Anonymous</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Your picks are encrypted. Nobody — not even the admin — sees who you chose unless it's mutual.
                </p>
              </div>
              <div className="mt-4 sm:mt-6 flex gap-1.5">
                {["🔒", "🔒", "🔒"].map((e, i) => (
                  <span key={i} className="text-base sm:text-lg opacity-40">{e}</span>
                ))}
              </div>
            </BentoCard>

            {/* Mini card — Games */}
            <BentoCard className="md:col-span-2 p-5 sm:p-7" glowColor="rgba(139,92,246,0.2)">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple mb-4 group-hover:scale-110 transition-transform">
                <Gamepad2 size={22} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-fredoka text-white mb-1.5 sm:mb-2">6 Mini Games</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Love Tester, Red Flag Swiper, Destiny Wheel, Rizz Roaster, Crush Analyzer & more.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["🎯", "🚩", "🎡", "💀", "💌", "🔥"].map((e, i) => (
                  <span key={i} className="text-lg sm:text-xl p-1.5 sm:p-2 bg-white/5 rounded-xl">{e}</span>
                ))}
              </div>
            </BentoCard>

            {/* Mini card — Polls */}
            <BentoCard className="md:col-span-2 p-5 sm:p-7" glowColor="rgba(34,211,238,0.15)">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <BarChart2 size={22} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-fredoka text-white mb-1.5 sm:mb-2">Community Polls</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Vote on Would You Rather, react to vibes, and see how your campus feels in real-time.
              </p>
              {/* Mock poll bars */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400/60 rounded-full" style={{ width: "68%" }} />
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold">68%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-pink/60 rounded-full" style={{ width: "32%" }} />
                  </div>
                  <span className="text-[10px] text-neon-pink font-bold">32%</span>
                </div>
              </div>
            </BentoCard>

            {/* Wide bottom card — The reveal moment */}
            <BentoCard className="md:col-span-2 p-5 sm:p-7 flex flex-col items-center text-center justify-center" glowColor="rgba(236,72,153,0.25)">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl sm:text-5xl mb-3 sm:mb-4"
              >
                💌
              </motion.div>
              <h3 className="text-lg sm:text-xl font-black font-fredoka text-white mb-1.5 sm:mb-2">Reveal Day</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                The big moment. Mutual matches unlock. Everything else stays secret. Forever.
              </p>
            </BentoCard>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ FINAL CTA ══ */}
      <section className="py-14 sm:py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <BentoCard className="p-6 sm:p-12 md:p-20 text-center" glowColor="rgba(236,72,153,0.3)">
            {/* Star ratings */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center gap-1 mb-4 sm:mb-6"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                >
                  <Star size={16} className="sm:w-5 sm:h-5" style={{ color: "#ec4899", fill: "#ec4899" }} />
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 sm:mb-6"
            >
              The reveal changes everything
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-black font-fredoka text-white mb-4 sm:mb-6 leading-tight"
            >
              Your crush might already{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue">
                be waiting
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2"
            >
              Register before slots close. 3 mystery names. Anonymous picks.
              Reveal Day decides everything — and only mutual matches count.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-xs sm:max-w-none mx-auto"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" icon={ArrowRight}
                    className="w-full sm:w-auto rounded-full px-10 sm:px-12 text-base font-bold shadow-[0_0_40px_rgba(236,72,153,0.5)] py-3.5 sm:py-3">
                    Join Genwin Now
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <p className="text-[10px] sm:text-xs text-gray-500 mt-6 sm:mt-8 tracking-wider">
              Free · Campus-only · Anonymous forever
            </p>
          </BentoCard>
        </div>
      </section>

    </PageWrapper>
  );
};

export default LandingPage;
