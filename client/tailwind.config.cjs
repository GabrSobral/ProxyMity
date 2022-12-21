const defaultConfig = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./index.html',
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		fontSize: {
			xs: '0.875rem',
			sm: '1rem',
			md: '1.125rem',
			lg: '1.25rem',
			xl: '1.5rem',
			'2xl': '2rem',
		},
		fontFamily: {
			sans: ['Inter', ...defaultConfig.fontFamily.sans],
			...defaultConfig.fontFamily,
		},
		extend: {
			colors: {
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
					500: '#718096',
					600: '#4A5568',
					700: '#2D3748',
					900: '#242625',
					950: '#1E1F1E',
				},
				green: {
					400: '#48BB78',
					600: '#25855A',
				},
				whiteAlpha: {
					900: '#FFFFFFEE',
				},
			},
		},
	},
	plugins: [require('@headlessui/tailwindcss')],
};
