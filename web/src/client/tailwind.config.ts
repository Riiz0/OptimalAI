import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(90deg, #9013FE 0%, #008FEC 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-60%)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        bounce: 'bounce 1s infinite ease-in-out',
      },
      colors: {
        background: {
          DEFAULT: '#10131A',
          secondary: '#1A1D24',
        },
        primary: {
          DEFAULT: '#7C3AED', // Purple for primary actions
          hover: '#8B5CF6',
        },
        text: {
          primary: '#FBFBFB', // White
          secondary: '#AAAABF', // Purplish
        },
        border: {
          DEFAULT: '#21212E', // Dark gray
        },
        green: {
          500: '#4FF570',
        },
        yellow: {
          500: '#FFD700',
        },
        red: {
          500: '#FF0000',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
