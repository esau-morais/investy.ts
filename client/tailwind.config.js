module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        auto: 'auto 1fr auto',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
