const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(0, 0%, 89.8%)',
        input: 'hsl(0, 0%, 89.8%)',
        ring: 'hsl(0, 0%, 63%)',
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(0, 0%, 3.9%)',
        primary: {
          DEFAULT: 'hsl(0, 0%, 9%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(0, 0%, 96.1%)',
          foreground: 'hsl(0, 0%, 9%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84.2%, 60.2%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        muted: {
          DEFAULT: 'hsl(0, 0%, 96.1%)',
          foreground: 'hsl(0, 0%, 45.1%)',
        },
        accent: {
          DEFAULT: 'hsl(0, 0%, 96.1%)',
          foreground: 'hsl(0, 0%, 9%)',
        },
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(0, 0%, 3.9%)',
        },
        popover: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(0, 0%, 3.9%)',
        },
      },
      borderRadius: {
        lg: '0.625rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
