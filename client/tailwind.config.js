/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        waPrimary: '#00a884',
        waPrimaryDark: '#008f6f',
        waHeader: '#f0f2f5',
        waBg: '#efeae2',
        waPanel: '#ffffff',
        waMsgMe: '#dcf8c6',
        waMsgOther: '#ffffff',
      }
    },
  },
  plugins: [],
}
