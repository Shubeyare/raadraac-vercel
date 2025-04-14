/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#E6D2B5", // Light earthy tone
          DEFAULT: "#D4B996", // Default earthy tone
          dark: "#B89B74", // Darker variant
        },
        secondary: {
          DEFAULT: "#654321", // Dark brown
        },
        accent: {
          DEFAULT: "#008080", // Teal
        },
      },
    },
  },
  plugins: [],
};
