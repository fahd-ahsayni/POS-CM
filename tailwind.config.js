/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Poppins',
                    ...defaultTheme.fontFamily.sans
                ]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			red: {
  				'50': '#FFDCDC',
  				'100': '#FFC8C8',
  				'200': '#FF9F9F',
  				'300': '#FF7676',
  				'400': '#FF4E4E',
  				'500': '#FF2525',
  				'600': '#FB0000',
  				'700': '#C30000',
  				'800': '#8B0000',
  				'900': '#530000',
  				'950': '#370000',
  				DEFAULT: '#FB0000'
  			},
  			zinc: {
  				'50': '#BFBFBF',
  				'100': '#B5B5B5',
  				'200': '#A1A1A1',
  				'300': '#8C8C8C',
  				'400': '#787878',
  				'500': '#646464',
  				'600': '#4F4F4F',
  				'700': '#3B3B3B',
  				'800': '#262626',
  				'900': '#121212',
  				'950': '#040404',
  				DEFAULT: '#121212'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			shine: {
  				from: {
  					backgroundPosition: '200% 0'
  				},
  				to: {
  					backgroundPosition: '-200% 0'
  				}
  			}
  		},
  		animation: {
  			shine: 'shine 8s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
