/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
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
	},
	plugins: [],
};
