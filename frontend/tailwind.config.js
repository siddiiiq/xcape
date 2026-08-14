/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        charcoal: "#161616",
        fog: "#e8e6e1",
        ember: "#c98a4b",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "'Anton'", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};
