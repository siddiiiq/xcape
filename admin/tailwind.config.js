/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#f7f7f5",
        panel: "#ffffff",
        ink: "#171717",
        line: "#e5e5e1",
        accent: "#c2410c",
        muted: "#71717a",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
