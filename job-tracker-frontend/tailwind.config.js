/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      animation: {
        in: "in 0.2s ease-out",
        "zoom-in-95": "zoom-in-95 0.2s ease-out",
        "slide-in-from-right-5": "slide-in-from-right-5 0.3s ease-out",
      },
      keyframes: {
        "zoom-in-95": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-from-right-5": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "glow-violet": "0 0 20px rgba(124, 58, 237, 0.25)",
        "glow-indigo": "0 0 20px rgba(99, 102, 241, 0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        dots: "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.3) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
