import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: theme('colors.neutral.700'),
            h1: { color: theme('colors.neutral.900') },
            h2: { color: theme('colors.neutral.900') },
            h3: { color: theme('colors.neutral.900') },
            h4: { color: theme('colors.neutral.900') },
            strong: { color: theme('colors.neutral.900') },
            a: { 
              color: theme('colors.neutral.900'),
              textDecoration: 'underline',
              '&:hover': { color: theme('colors.neutral.600') }
            },
            code: { color: theme('colors.neutral.900') },
            blockquote: { color: theme('colors.neutral.700') },
          },
        },
        invert: {
          css: {
            color: theme('colors.neutral.300'),
            h1: { color: theme('colors.neutral.100') },
            h2: { color: theme('colors.neutral.100') },
            h3: { color: theme('colors.neutral.100') },
            h4: { color: theme('colors.neutral.100') },
            strong: { color: theme('colors.neutral.100') },
            a: { 
              color: theme('colors.neutral.100'),
              textDecoration: 'underline',
              '&:hover': { color: theme('colors.neutral.400') }
            },
            code: { color: theme('colors.neutral.100') },
            blockquote: { color: theme('colors.neutral.300') },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
  ],
}
export default config
