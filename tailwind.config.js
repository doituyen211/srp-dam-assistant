/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a5f",
        "primary-light": "#2d4a7a",
        "primary-dark": "#142b4a",
        ink: "#1a1d21",
        "body-muted": "#515a63",
        muted: "#8a929b",
        canvas: "#ffffff",
        "app-bg": "#f4f5f7",
        subdued: "#eef0f2",
        hairline: "#d4d8dd",
        "border-light": "#c5cbd1",
        "card-border": "#edeeef",
        success: "#0d7a3e",
        "success-bg": "#e8f5ed",
        warning: "#b45309",
        "warning-bg": "#fef7e8",
        danger: "#bc1c1e",
        "danger-bg": "#fdeeef",
        info: "#2563eb",
        "info-bg": "#eef3fc",
        unset: "#7d8590",
        emerald: "#0d7a3e",
        teal: "#0d5e6b",
        indigo: "#4338ca",
        purple: "#7c3aed",
        sky: "#0369a1",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        serif: [
          "var(--font-serif)",
          "Georgia",
          "Times New Roman",
          "Times",
          "serif",
        ],
        display: [
          "var(--font-display)",
          "Space Grotesk",
          "ui-sans-serif",
          "system-ui",
        ],
        mono: [
          "var(--font-mono)",
          "IBM Plex Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      borderRadius: {
        card: "0.5rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
      fontSize: {
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],
        body: ["0.9375rem", { lineHeight: "1.7" }],
      },
    },
  },
  plugins: [],
};

module.exports = config;
