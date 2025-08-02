/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        border: "inset 0 0 0 1px #000000",
      },
      backgroundImage: {
        "gradient-homepage":
          "linear-gradient(180deg, #F8FEBA 0%, #EAECE1 49.4%)",
      },
      colors: {
        black: "#131313",
        gray: {
          DEFAULT: "#888",
        },
        light: {
          base: "#EAECE1",
        },
        secondary: {
          500: "#6D6D6D",
        },
        yellow: {
          DEFAULT: "#F5FF89",
          hover: "#F7FF45",
          card: "#F8FEBA",
        },
        chip: {
          disabled: "#B0B0B0",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        "roboto-mono": ["var(--font-roboto-mono)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
