import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
