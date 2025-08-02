/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f1',
          100: '#dbf1de',
          200: '#b9e2c1',
          300: '#8dcc9a',
          400: '#5dae6f',
          500: '#4b9f5a',
          600: '#2C5F2D',
          700: '#2c5830',
          800: '#264828',
          900: '#203b23',
        },
        secondary: {
          50: '#f7faf4',
          100: '#eef5e6',
          200: '#ddeace',
          300: '#c6daa7',
          400: '#97BC62',
          500: '#8bb259',
          600: '#729144',
          700: '#5a7036',
          800: '#4a5a2e',
          900: '#404c29',
        },
        accent: {
          50: '#fef9f4',
          100: '#fef2e7',
          200: '#fce1c3',
          300: '#f9cb94',
          400: '#F4A460',
          500: '#f19542',
          600: '#e2782a',
          700: '#bb5d24',
          800: '#964a24',
          900: '#7a3e20',
        },
        surface: '#F5F5DC',
        background: '#FAFAF5'
      },
      fontFamily: {
        'display': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}