/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          800: '#1e40af',
        },
      },
      animation: {
        ripple: "ripple 0.6s linear",
      },
      keyframes: {
        ripple: {
          "0%": {
            transform: "scale(0)",
            opacity: "0.8",
          },
          "100%": {
            transform: "scale(4)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
