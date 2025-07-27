/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ocean-blue": "#005B96",
        navy: "#0A2540",
        "sunset-gold": "#FFD166",
        "pearl-white": "#F7F9FC",
        teal: "#00BFA5",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        "2xl": "1rem",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(45deg, #FFD166, #FFA726)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
