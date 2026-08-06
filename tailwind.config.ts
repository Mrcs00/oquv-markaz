import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fffcf2",
          100: "#fff4d6",
          500: "#ffc82c",
          600: "#ffc82c",
          700: "#e0ac16",
        },
        success: {
          50: "#ecfdf5",
          500: "#10b981",
          600: "#059669",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
        },
        info: {
          50: "#eff6ff",
          500: "#3b82f6",
        },
        surface: "#f8fafc",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 8px 0 rgb(0 0 0 / 0.04)",
        cardHover: "0 4px 16px 0 rgb(0 0 0 / 0.08)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
