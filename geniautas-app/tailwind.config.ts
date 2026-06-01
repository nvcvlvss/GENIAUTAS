import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			border: 'var(--color-border)',
  			input: 'var(--color-surface-2)',
  			ring: 'var(--color-primary)',
  			background: 'var(--color-bg)',
  			foreground: 'var(--color-text)',
  			primary: {
  				DEFAULT: 'var(--color-primary)',
  				foreground: '#0b1220'
  			},
  			secondary: {
  				DEFAULT: 'var(--color-surface-2)',
  				foreground: 'var(--color-text)'
  			},
  			destructive: {
  				DEFAULT: 'var(--color-danger)',
  				foreground: 'var(--color-text)'
  			},
  			muted: {
  				DEFAULT: 'var(--color-surface-1)',
  				foreground: 'var(--color-text-tertiary)'
  			},
  			accent: {
  				DEFAULT: 'var(--color-surface-3)',
  				foreground: 'var(--color-text)'
  			},
  			popover: {
  				DEFAULT: 'var(--color-bg-elevated)',
  				foreground: 'var(--color-text)'
  			},
  			card: {
  				DEFAULT: 'var(--color-bg-elevated)',
  				foreground: 'var(--color-text)'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius-lg)',
  			md: 'var(--radius-md)',
  			sm: 'var(--radius-sm)'
  		},
      animation: {
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
