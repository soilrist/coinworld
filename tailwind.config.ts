import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px", "2xl": "1440px" },
    },
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FAF6EE",
          50: "#FFFEFC",
          100: "#FAF6EE",
          200: "#F2EAD9",
          300: "#E8DBC0",
          400: "#DCC9A3",
        },
        soil: {
          DEFAULT: "#4A3626",
          50: "#F4EDE7",
          100: "#E4D3C3",
          200: "#C9AC8E",
          300: "#A9835F",
          400: "#7C5C3E",
          500: "#4A3626",
          600: "#3D2C1F",
          700: "#302219",
          800: "#241A13",
          900: "#18110C",
        },
        olive: {
          DEFAULT: "#6B6B45",
          50: "#F1F1E8",
          100: "#DEDFC6",
          200: "#C1C39A",
          300: "#A3A66D",
          400: "#888C52",
          500: "#6B6B45",
          600: "#565638",
          700: "#41412A",
          800: "#2C2C1D",
          900: "#17170F",
        },
        charcoal: {
          DEFAULT: "#2A2723",
          50: "#EFEEEC",
          100: "#D8D5D0",
          200: "#B3ADA4",
          300: "#8C8478",
          400: "#655D50",
          500: "#453F36",
          600: "#2A2723",
          700: "#201E1A",
          800: "#161513",
          900: "#0C0B0A",
        },
        burgundy: {
          DEFAULT: "#7A2A2E",
          50: "#F7E9EA",
          100: "#EBC5C7",
          200: "#D8969B",
          300: "#C0666C",
          400: "#9E4148",
          500: "#7A2A2E",
          600: "#642227",
          700: "#4E1B1E",
          800: "#391315",
          900: "#230B0D",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif-kr)", "Noto Serif KR", "serif"],
      },
      fontSize: {
        base: ["1rem", { lineHeight: "1.7" }],
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(24, 17, 12, 0.25)",
        card: "0 2px 12px -4px rgba(24, 17, 12, 0.12)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.15s ease-out both",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
