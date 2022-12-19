/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./index.html', './src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontSize: {
				xs: '0.875rem',
				sm: '1rem',
				md: '1.125rem',
				lg: '1.25rem',
				xl: '1.5rem',
				'2xl': '2rem',
			},
		},
	},
	plugins: [],
};
