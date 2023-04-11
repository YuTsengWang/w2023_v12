/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,hbs}",
  ],
  theme: {
    extend: {
      height:{
        md: '240px',
      },
      width:{
        md:'160px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
