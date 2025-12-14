/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom OwnMon brand colors matching API categories
        brand: {
          bg: '#0a0a0f',
          surface: '#13131a',
          border: '#1f1f28',
          text: '#e4e4e7',
          'text-muted': '#a1a1aa',
        },
        category: {
          other: '#9CA3AF',
          work: '#3B82F6',
          entertainment: '#EF4444',
          communication: '#10B981',
          browser: '#F59E0B',
          system: '#6B7280',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
