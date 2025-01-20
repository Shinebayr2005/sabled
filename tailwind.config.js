/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Scan your source files for Tailwind classes
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        fadeOut: {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.9)" },
        },
        ripple: {
          "0%": {
            transform: "scale(0)",
            opacity: "0.5",
          },
          "100%": {
            transform: "scale(4)",
            opacity: "0",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out forwards",
        fadeOut: "fadeOut 0.3s ease-in-out",
        ripple: "ripple 0.6s linear",
      },
      colors: {
        default: {
          solid: "#e5e7eb",
          outlined: "#f3f4f6",
          text: "#374151",
          hover: "#d1d5db",
        },
        primary: {
          solid: "#3b82f6",
          outlined: "#e0f2fe",
          text: "#ffffff",
          hover: "#2563eb",
        },
        danger: {
          solid: "#ef4444",
          outlined: "#fee2e2",
          text: "#ffffff",
          hover: "#dc2626",
        },
        success: {
          solid: "#22c55e",
          outlined: "#d1fae5",
          text: "#ffffff",
          hover: "#16a34a",
        },
      },
    },
  },
  plugins: [],
};


