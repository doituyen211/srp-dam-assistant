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
        primary: "#17171c",
        ink: "#212121",
        "deep-green": "#003c33",
        "dark-navy": "#071829",
        canvas: "#ffffff",
        "app-bg": "#f5f5f0",
        "soft-stone": "#eeece7",
        "pale-green": "#edfce9",
        "pale-blue": "#f1f5ff",
        hairline: "#d9d9dd",
        muted: "#93939f",
        slate: "#75758a",
        "body-muted": "#616161",
        "action-blue": "#1863dc",
        coral: "#ff7759",
        error: "#b30000",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
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
        card: "0.75rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 2px 12px rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
