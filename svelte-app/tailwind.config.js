import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
   darkMode: ['class'],
   content: ['./src/**/*.{html,js,svelte,ts}'],
   safelist: ['dark'],
   theme: {
      container: {
         center: true,
         padding: '2rem',
         screens: {
            '2xl': '1400px',
         },
      },
      extend: {
         backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
         },
         colors: {
            pink: {
               800: '#B809A6',
            },
            purple: {
               400: '#5852D6',
               500: '#9218DE',
               700: '#561564',
               900: '#0F063C',
            },
            blue: {
               500: '#1868CE',
            },
            orange: {
               100: '#FEEBCB',
               300: '#F6AD55',
               500: '#DD6B20',
            },
            red: {
               200: '#FEB2B2',
               500: '#F12646',
            },
            gray: {
               50: '#F7FAFC',
               200: '#E2E8F0',
               300: '#8D9098',
               500: '#718096',
               600: '#4A5568',
               700: '#2D3748',
               800: '#20232B',
               900: '#1D1E24',
               950: '#15161A',
            },

            border: 'hsl(var(--border) / <alpha-value>)',
            input: 'hsl(var(--input) / <alpha-value>)',
            ring: 'hsl(var(--ring) / <alpha-value>)',
            background: 'hsl(var(--background) / <alpha-value>)',
            foreground: 'hsl(var(--foreground) / <alpha-value>)',
            primary: {
               DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
               foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
            },
            secondary: {
               DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
               foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
            },
            destructive: {
               DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
               foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
            },
            muted: {
               DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
               foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
            },
            accent: {
               DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
               foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
            },
            popover: {
               DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
               foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
            },
            card: {
               DEFAULT: 'hsl(var(--card) / <alpha-value>)',
               foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
            },
            colors: {
               pink: {
                  800: '#B809A6',
               },
               purple: {
                  400: '#5852D6',
                  500: '#9218DE',
                  700: '#561564',
                  900: '#0F063C',
               },
               blue: {
                  500: '#1868CE',
               },
               orange: {
                  100: '#FEEBCB',
                  300: '#F6AD55',
                  500: '#DD6B20',
               },
               red: {
                  200: '#FEB2B2',
                  500: '#F12646',
               },
               gray: {
                  50: '#F7FAFC',
                  200: '#E2E8F0',
                  300: '#8D9098',
                  500: '#718096',
                  600: '#4A5568',
                  700: '#2D3748',
                  800: '#20232B',
                  900: '#1D1E24',
                  950: '#15161A',
               },
            },
            backgroundImage: {
               'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
               'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
         },
         borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
         },
         fontFamily: {
            sans: [...fontFamily.sans],
         },
      },
   },
};

export default config;
