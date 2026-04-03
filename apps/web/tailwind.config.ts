import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0A0A0B",
          secondary: "#111113",
          tertiary: "#1A1A1E",
          elevated: "#222226",
        },
        border: {
          subtle: "#1F1F23",
          default: "#2A2A2F",
          strong: "#3A3A40",
        },
        text: {
          primary: "#EDEDEF",
          secondary: "#8E8E93",
          tertiary: "#5A5A5F",
          inverse: "#0A0A0B",
        },
        accent: {
          primary: "#2563EB",
          hover: "#3B82F6",
          subtle: "#1E3A5F",
          glow: "rgba(37, 99, 235, 0.15)",
        },
        status: {
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "system-ui", "sans-serif"],
        display: ["Satoshi", "General Sans", "Inter Variable", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": ["12px", { lineHeight: "16px" }],
        xs: ["13px", { lineHeight: "18px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["20px", { lineHeight: "28px" }],
        xl: ["24px", { lineHeight: "32px" }],
        "2xl": ["32px", { lineHeight: "40px" }],
        "3xl": ["40px", { lineHeight: "48px" }],
        "4xl": ["48px", { lineHeight: "56px" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)",
        card: "0 4px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
        elevated: "0 8px 24px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
        modal: "0 16px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
        "accent-glow": "0 0 20px rgba(37,99,235,0.15)",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "shimmer": "shimmer 1.5s infinite",
        "fade-in": "fadeIn 200ms ease",
        "slide-up": "slideUp 200ms ease",
        "scale-in": "scaleIn 200ms ease",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
