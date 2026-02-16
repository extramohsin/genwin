/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Deep Dark Backgrounds
        dark: {
          950: "#020617", // Main background (Deep Navy/Black)
          900: "#0f172a", // Secondary
          800: "#1e293b", // Card background
        },
        // Neon Accents (Glow Theme)
        neon: {
          pink: "#ec4899", // Prominent Pink
          purple: "#8b5cf6", // Deep Purple
          blue: "#3b82f6", // Electric Blue
          yellow: "#f59e0b", // Golden/Warn
        },
        // Glassmorphism Utilities
        glass: {
          border: "rgba(255, 255, 255, 0.1)",
          surface: "rgba(255, 255, 255, 0.05)",
          highlight: "rgba(255, 255, 255, 0.15)",
        }
      },
      fontFamily: {
        fredoka: ['"Fredoka"', "sans-serif"],
        outfit: ['"Outfit"', "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "blob": "blob 7s infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(236, 72, 153, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(236, 72, 153, 0.6), 0 0 10px rgba(236, 72, 153, 0.4)" },
        }
      },
    },
  },
  plugins: [],
}
