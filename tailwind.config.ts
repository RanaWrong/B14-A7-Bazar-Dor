import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bazar: {
          50: "#eefaf3",
          100: "#d7f3e2",
          200: "#b2e6c8",
          300: "#7fd3a7",
          400: "#49ba82",
          500: "#279f64",
          600: "#1a804e",
          700: "#00875a",
          800: "#145637",
          900: "#11472e",
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "marquee-fast": "marquee 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

