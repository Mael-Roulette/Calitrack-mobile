/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./*.{js,jsx,ts,tsx}"
  ],
  presets: [ require( "nativewind/preset" ) ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#132541",
          50: "#AEC4E7",
          100: "#617188"
        },
        secondary: "#FC7942",
        background: "#FFF9F7",
        green: "#34A92F",
      },
      fontFamily: {
        calsans: [ "CalSans-Regular", "sans-serif" ],
        sregular: [ "Sora-Regular", "sans-serif" ],
      },
    },
  },
  plugins: [],
}