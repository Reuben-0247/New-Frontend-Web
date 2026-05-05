import type { Config } from "tailwindcss";
// import typography from "@tailwindcss/typography";
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        floating: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(-120vh)", opacity: "0" },
        },
      },
      animation: {
        floating: "floating 6s linear infinite",
      },
    },
  },
  // plugins: [typography],
} satisfies Config;
