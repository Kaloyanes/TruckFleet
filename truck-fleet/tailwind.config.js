const animate = require("tailwindcss-animate")

/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {

  },
  daisyui: {
    themes: [
      'light',
      'forest',
      {
        'mytheme': {
          "primary": "rgb(192 132 252)",
          "dark-primary": "#9A7AA0",
          "secondary": "#ffffff",
          "accent": "#ffffff",
          "neutral": "#ffffff",
          "base-100": "#050505",
          "info": "rgb(120 0 255)",
          "success": "#00ffff",
          "warning": "#ffffff",
          "error": "rgb(192 40 40)",
        },
      },
    ],
  },
  plugins: [animate, require('daisyui')],
}
