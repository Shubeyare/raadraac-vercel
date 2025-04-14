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
        background: "#f8f7f4",
        foreground: "#2a2a2a",
        surface: "#ffffff",
        error: "#e53935",
        success: "#43a047",
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.75rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      boxShadow: {
        sm: "0 2px 4px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.625rem",
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        300: "300ms",
        500: "500ms",
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
  // Remove experimental flags
  future: {
    hoverOnlyWhenSupported: true,
  },
};
