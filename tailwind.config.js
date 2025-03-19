/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        indigo: {
          900: '#1a1a4a',
        },
        purple: {
          800: '#4a2a82',
        },
        teal: {
          800: '#184e59',
        },
      },
      animation: {
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
      },
      boxShadow: {
        glow: '0 0 15px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
};
