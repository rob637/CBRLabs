/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(at 0% 0%, rgba(70,190,254,0.22) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(168,85,247,0.20) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(34,211,238,0.18) 0px, transparent 50%)",
        "mesh-dark":
          "radial-gradient(at 0% 0%, rgba(70,190,254,0.18) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(168,85,247,0.16) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(34,211,238,0.14) 0px, transparent 50%)",
      },
      animation: {
        "float-slow": "float 16s ease-in-out infinite",
        "float-slower": "float 24s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(20px,-30px,0)" },
        },
      },
    },
  },
  plugins: [],
};
