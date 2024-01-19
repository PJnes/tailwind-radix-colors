/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./**/test.html"],
  jit: false,
  theme: {
    extend: {},
  },
  plugins: [
    require("../dist/index.js")({
      colors: {
        shade: "slate",
        accent: "crimson",
        iris: "iris",
        grass: "grass",
        amber: "amber",
      },
      darkModeSelector: ".dark",
      // respectMediaQuery: false,
    }),
  ],
};
