import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: { 950: "#0A0D0C", 900: "#0E1311", 800: "#141A18", 700: "#1C2421" },
        emerald: { 400: "#34D399", 500: "#10B981", 700: "#047857" },
        gold: { 200: "#F2E2A6", 400: "#D4AF37", 600: "#A88A22" },
        ivory: "#EDEBE4",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: { expo: "cubic-bezier(.22,1,.36,1)" },
      boxShadow: {
        glow: "0 0 40px rgba(16,185,129,.35)",
        gold: "0 0 40px rgba(212,175,55,.3)",
      },
    },
  },
  plugins: [],
};
export default config;
