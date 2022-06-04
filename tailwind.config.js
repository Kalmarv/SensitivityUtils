module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['dracula'],
  },
  plugins: [require('daisyui')],
}
