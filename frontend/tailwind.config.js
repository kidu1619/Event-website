/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#FAF5EC',
          200: '#F3E7D3',
          300: '#EAD5B5',
          400: '#DEC092',
          500: '#D4AF37',
          600: '#BF9827',
          700: '#9E7A1B',
          800: '#7E5F15',
          900: '#5C440F',
        },
        champagne: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E8DDCB',
          300: '#DAC6AD',
          400: '#CBB090',
          500: '#BC9974',
          600: '#A4805B',
          700: '#836547',
          800: '#644D36',
          900: '#463525',
        },
        obsidian: {
          800: '#1E222B',
          900: '#12151B',
          950: '#0B0D11',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-up': 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}