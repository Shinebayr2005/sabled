/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary-color) / <alpha-value>)",
        },
      },
      animation: {
        // Only keep the animations actually used in components
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
        "slide-left": "slideLeft 0.2s ease-out",
        "slide-right": "slideRight 0.2s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(8px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-8px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
