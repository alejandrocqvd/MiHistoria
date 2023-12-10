/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#242424',
        secondary: '#3A3A3A',
        tertiary: '#3A3A3A',
        text: '#E0E0E0',
        important: '#6600cc',
      },
      fontFamily: {
        'red-hat-display': ['Red Hat Display', 'sans-serif'],
        'notable': ['Notable', 'sans-serif'],
      },
      backgroundImage: {
        'text-gradient': 'linear-gradient(90deg, rgba(153,0,255,1) 0%, rgba(204,128,255,1) 100%)',
      },
      borderColor: {
        'white': '#ffffff',
      },
    },
  },
  plugins: [],
}
