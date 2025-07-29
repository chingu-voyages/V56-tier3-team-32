/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        primary: '#2C3E50',
        secondary: '#ECF0F1',
        accent: '#50E3C2',
        'font-secondary': '#7F8C8D',
        'border-line': '#DCE1E3',
        hover: '#AED6F1',
      },
    },
  },
  plugins: [],
};
