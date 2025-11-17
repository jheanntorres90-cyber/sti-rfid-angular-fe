/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal-blue': '#0f172a',
        'indigo-blue': '#1e3a8a',
        'averis-blue': '#010081',
      },
    },
  },
  plugins: [],
}

