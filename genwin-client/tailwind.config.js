/* eslint-env node */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      primary: {
        light: "#FF9A5F",
        DEFAULT: "#FF3CAC",
        dark: "#E31B8D",
      },
      secondary: {
        light: "#8F88FF",
        DEFAULT: "#6C63FF",
        dark: "#4A42FF",
      },
    },
    animation: {
      gradient: "gradient 8s linear infinite",
      "bounce-slow": "bounce 3s linear infinite",
    },
    keyframes: {
      gradient: {
        "0%, 100%": {
          "background-size": "200% 200%",
          "background-position": "left center",
        },
        "50%": {
          "background-size": "200% 200%",
          "background-position": "right center",
        },
      },
    },
  },
};
export const plugins = [];
