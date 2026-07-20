import type { Config } from "tailwindcss";

// All surface/text colors resolve through CSS variables so the whole app
// re-skins between dark (default) and light via a single class on <html>.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--bg) / <alpha-value>)",
        "ink-2": "rgb(var(--bg-2) / <alpha-value>)",
        "ink-3": "rgb(var(--bg-3) / <alpha-value>)",
        paper: "rgb(var(--fg) / <alpha-value>)",
        "paper-dim": "rgb(var(--fg-dim) / <alpha-value>)",
        "paper-faint": "rgb(var(--fg-faint) / <alpha-value>)",
        // Hairlines and hover surfaces (alpha baked into the variable).
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        elevate: "var(--elevate)",
        // The single accent: deep saffron. Used sparingly.
        saffron: "#E8873A",
        "saffron-soft": "#F0A45F",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        glow: "0 0 40px rgba(232,135,58,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
