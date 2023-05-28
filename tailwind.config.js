/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        'primary': '#1D1E22',
        'secondary': '#38393D',
        'focus': '#3DBDA7'
      },
      fontFamily: {
        'main': ['Montserrat']
      },
    },
  },
  plugins: [],
}

