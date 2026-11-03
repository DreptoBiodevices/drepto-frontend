/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',

    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
            colors: {
        primary: {
          DEFAULT: '#0B6F6D',
          hover: '#0B5C5A',
          dark: '#0A4A49',
          light: '#429695',
        },
        secondary: {
          DEFAULT: '#E17C61',
          hover: '#C86146',
          light: '#F8D4CB',
        },
        'light-blue': '#F4F9F9',
        'dark-blue': '#242B2B',
        accent: {
          DEFAULT: '#E17C61',
          hover: '#C86146',
          teal: '#0B6F6D',
        },
        coral: {
          50: '#FDF7F5',
          100: '#FCECE8',
          200: '#F8D4CB',
          300: '#F1B2A1',
          400: '#E99279',
          500: '#E17C61',
          600: '#C86146',
          700: '#A64B33',
        },
        charcoal: {
          DEFAULT: '#242B2B',
          50: '#F6F7F7',
          100: '#E9EAEA',
          200: '#CFD2D2',
          300: '#9CA3A3',
          400: '#5E6666',
          500: '#242B2B',
          600: '#1D2323',
          700: '#171B1B',
          800: '#101414',
          900: '#052121',
        },
        brand: {
          50: '#F4F9F9',
          100: '#D0E6E6',
          200: '#A6D1D0',
          300: '#75B6B4',
          400: '#429695',
          500: '#0B6F6D',
          600: '#0B5C5A',
          700: '#0A4A49',
          800: '#083837',
          900: '#052121',
          950: '#052121',
        },
        clinical: {
          card: '#ffffff',
          surface: '#F4F9F9',
          border: '#D0E6E6',
          muted: '#5E6666',
          navy: '#242B2B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'elevated': '0 20px 30px -10px rgba(13, 148, 136, 0.08), 0 8px 12px -4px rgba(15, 23, 42, 0.04)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-up-sheet': 'slideUpSheet 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards',
        'zoom-in': 'zoomIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUpSheet: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    }
  },
  plugins: []
};
