import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        navy: {
          50: "#eef3fb",
          100: "#dbe4f3",
          200: "#b5c6e4",
          500: "#1d4a8f",
          700: "#0a2f66",
          800: "#032454",
          900: "#021a3d",
          950: "#01112a",
        },
        gold: {
          50: "#fffaeb",
          100: "#fdf0c4",
          300: "#f5cc55",
          400: "#efb82a",
          500: "#e2a100",
          600: "#c48a00",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
}

export default config
