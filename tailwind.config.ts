import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A66C2',
        darkBlue: '#004182',
        lightBlue: '#EBF3FF',
        accentBlue: '#70B5F9',
        offWhite: '#F3F2EF',
        textDark: '#1D2226',
        textGray: '#666666',
        success: '#057642',
        warning: '#E7A33E',
        error: '#CC1016',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        pill: '24px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(112,181,249,0.3)' },
          '50%': { boxShadow: '0 0 16px rgba(112,181,249,0.75)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)',
      },
    },
  },
  plugins: [],
}

export default config