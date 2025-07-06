/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    // Tooltip arrow border colors - ensure these never get purged
    'border-b-gray-800', 'border-t-gray-800', 'border-l-gray-800', 'border-r-gray-800',
    'border-b-gray-600', 'border-t-gray-600', 'border-l-gray-600', 'border-r-gray-600',
    'border-b-gray-300', 'border-t-gray-300', 'border-l-gray-300', 'border-r-gray-300',
    'border-b-gray-100', 'border-t-gray-100', 'border-l-gray-100', 'border-r-gray-100',
    'border-b-blue-600', 'border-t-blue-600', 'border-l-blue-600', 'border-r-blue-600',
    'border-b-blue-100', 'border-t-blue-100', 'border-l-blue-100', 'border-r-blue-100',
    'border-b-green-600', 'border-t-green-600', 'border-l-green-600', 'border-r-green-600',
    'border-b-green-100', 'border-t-green-100', 'border-l-green-100', 'border-r-green-100',
    'border-b-yellow-600', 'border-t-yellow-600', 'border-l-yellow-600', 'border-r-yellow-600',
    'border-b-yellow-100', 'border-t-yellow-100', 'border-l-yellow-100', 'border-r-yellow-100',
    'border-b-red-600', 'border-t-red-600', 'border-l-red-600', 'border-r-red-600',
    'border-b-red-100', 'border-t-red-100', 'border-l-red-100', 'border-r-red-100',
    'border-b-cyan-600', 'border-t-cyan-600', 'border-l-cyan-600', 'border-r-cyan-600',
    'border-b-cyan-100', 'border-t-cyan-100', 'border-l-cyan-100', 'border-r-cyan-100',
    'border-b-white', 'border-t-white', 'border-l-white', 'border-r-white',
    // Tooltip arrow size classes
    'border-l-[5px]', 'border-r-[5px]', 'border-t-[5px]', 'border-b-[5px]',
    'border-l-[6px]', 'border-r-[6px]', 'border-t-[6px]', 'border-b-[6px]',
    'border-l-[7px]', 'border-r-[7px]', 'border-t-[7px]', 'border-b-[7px]',
    // Common utility classes
    'drop-shadow-md',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "rgb(var(--color-primary-50) / <alpha-value>)",
          100: "rgb(var(--color-primary-100) / <alpha-value>)",
          200: "rgb(var(--color-primary-200) / <alpha-value>)",
          300: "rgb(var(--color-primary-300) / <alpha-value>)",
          400: "rgb(var(--color-primary-400) / <alpha-value>)",
          500: "rgb(var(--color-primary-500) / <alpha-value>)",
          600: "rgb(var(--color-primary-600) / <alpha-value>)",
          700: "rgb(var(--color-primary-700) / <alpha-value>)",
          800: "rgb(var(--color-primary-800) / <alpha-value>)",
          900: "rgb(var(--color-primary-900) / <alpha-value>)",
          DEFAULT: "var(--color-primary, #006fee)",
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
