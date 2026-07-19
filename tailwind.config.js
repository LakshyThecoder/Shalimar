/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        editorial: ['"Cormorant Garamond"', "serif"],
        body: ['"Outfit"', "sans-serif"],
      },
      colors: {
        sh: {
          bg: "#0A0908",
          surface: "#161310",
          text: "#F2EDE6",
          muted: "#9A9085",
          saffron: "#E8A317",
          chili: "#D9401A",
          turmeric: "#F0C14A",
          border: "#2A2620",
        },
      },
    },
  },
  plugins: [],
};
