import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        // Couleurs de la charte Genetics
        primary: { DEFAULT: "#032454", foreground: "#ffffff" },
        accent: { DEFAULT: "#e2a100", foreground: "#ffffff" },
        "genetics-dark-blue": {
          50: "#e0e4eb",
          100: "#c0c9d7",
          200: "#a0afc3",
          300: "#6f84a3",
          400: "#3e5a83",
          500: "#1a3a6a",
          600: "#0b2d5f",
          700: "#032454",
          800: "#021c42",
          900: "#011430",
          950: "#000c1e",
        },
        "genetics-gold": {
          50: "#fff8e0",
          100: "#ffefb3",
          200: "#ffe685",
          300: "#ffdd58",
          400: "#ffd42b",
          500: "#e2a100",
          600: "#c98f00",
          700: "#a37400",
          800: "#7d5900",
          900: "#573e00",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        // Animations d'entrée de la page d'accueil
        "hero-zoom": { from: { transform: "scale(1.18)" }, to: { transform: "scale(1)" } },
        "ken-burns": { from: { transform: "scale(1) translate3d(0,0,0)" }, to: { transform: "scale(1.07) translate3d(-1.5%,-1%,0)" } },
        "veil-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "word-rise": { from: { transform: "translateY(110%)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        "fade-up": { from: { transform: "translateY(24px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        "slide-down": { from: { transform: "translateY(-100%)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        "grow-x": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        float: { "0%, 100%": { transform: "translate3d(0,0,0)" }, "50%": { transform: "translate3d(30px,-40px,0)" } },
        "scroll-dot": { "0%": { transform: "translateY(0)", opacity: "1" }, "80%": { transform: "translateY(14px)", opacity: "0" }, "100%": { opacity: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "hero-bg": "hero-zoom 2.4s cubic-bezier(0.16,1,0.3,1) both, ken-burns 24s ease-in-out 2.4s infinite alternate",
        "veil-out": "veil-out 1.4s ease-out 0.1s both",
        "word-rise": "word-rise 0.9s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up": "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) both",
        "slide-down": "slide-down 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "grow-x": "grow-x 0.9s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 14s ease-in-out infinite",
        "scroll-dot": "scroll-dot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
