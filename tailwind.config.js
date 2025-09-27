/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/shadcn-ui/**/*.{js,ts,jsx,tsx}", // if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [import("tailwindcss-animate").then((mod) => mod.default || mod)],
};
