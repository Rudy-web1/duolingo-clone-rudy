import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Duolingo's actual brand palette
        duo: {
          green: "#58CC02",
          greenDark: "#58A700",
          greenLight: "#89E219",
          blue: "#1CB0F6",
          blueDark: "#1899D6",
          red: "#FF4B4B",
          redDark: "#EA2B2B",
          gold: "#FFC800",
          goldDark: "#E6B400",
          purple: "#CE82FF",
          purpleDark: "#A568D6",
          gray: "#E5E5E5",
          grayDark: "#AFAFAF",
          text: "#3C3C3C",
          bg: "#FFFFFF",
          bgSoft: "#F7F7F7",
        },
      },
      fontFamily: {
        // Duolingo uses a rounded, heavy sans (Feather Bold-ish). DIN Round /
        // Nunito are the closest freely-available approximations.
        sans: ["var(--font-nunito)", "Nunito", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1rem",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        bounceIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 0.25s ease-out",
        shake: "shake 0.4s ease-in-out",
        bounceIn: "bounceIn 0.35s ease-out",
        floaty: "floaty 2.4s ease-in-out infinite",
        slideUp: "slideUp 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
