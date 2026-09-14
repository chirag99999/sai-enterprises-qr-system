import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#779BAD",
          "blue-light": "#98B5C5",
          "blue-dark": "#557B8F",
          yellow: "#F1EA99",
          "yellow-light": "#FAF6CE",
          "yellow-dark": "#D6CE65",
          dark: "#040505",
          surface: "#F3F3F3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
        "glass-elevated": "0 16px 40px 0 rgba(0, 0, 0, 0.12)",
        glow: "0 0 25px rgba(241, 234, 153, 0.45)",
        "glow-blue": "0 0 25px rgba(119, 155, 173, 0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
