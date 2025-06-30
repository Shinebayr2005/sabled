/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary-color) / <alpha-value>)",
        },
      },
      animation: {
        ripple: "ripple 0.6s linear",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-soft": "bounce 1s infinite",
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
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        slideIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 20px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)",
        strong:
          "0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 40px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
