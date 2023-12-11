/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E1E1E',
        secondary: '#323232',
        tertiary: '#474747',
        text: '#FFFFFF',
        important: '#6600cc',
      },
      fontFamily: {
        'red-hat-display': ['Red Hat Display', 'sans-serif'],
        'notable': ['Notable', 'sans-serif'],
      },
      backgroundImage: {
        'gradient': 'linear-gradient(90deg, rgba(102,0,204,1) 0%, rgba(179,0,89,1) 100%)',
      },
      borderColor: {
        'white': '#ffffff',
      },
    },
  },
  plugins: [],
}
