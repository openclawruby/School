/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#eff6ff',100:'#dbeafe',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',900:'#1e3a8a' },
        accent: { 50:'#fef3c7',500:'#f59e0b',600:'#d97706' }
      },
      fontFamily: { sans: ['"Noto Sans TC"','"PingFang TC"','system-ui','sans-serif'] }
    }
  },
  plugins: []
};