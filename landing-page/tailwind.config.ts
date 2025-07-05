import type { Config } from 'tailwindcss';
import { colors } from './src/commons/colors';
const config: Config = {
	theme: {
		extend: {
			spacing: {
				app: '100px',
				50: '50px',
				px: '1px',
			},
			lineHeight: {
				full: '100%',
			},
			animate: {
				'fly-in': 'fly-in 0.3s ease-out forwards',
				'land-in': 'land-in 0.3s ease-out forwards',
				'fade-in': 'fade-in 0.3s ease-out forwards',
				'to-left': 'to-left 0.3s ease-out forwards',
				'to-right': 'to-right 0.3s ease-out forwards',
				'scaleX': 'scaleX 0.3s ease-out forwards',
				'texting': 'texting 2s steps(12, end) alternate',
			},
			keyframes: {
				'fly-in': {
					'0%': { transform: 'translateY(100%)', opacity: 0 },
					'100%': { transform: 'translateY(0)', opacity: 1 },
				},
				'fly-out': {
					'0%': { transform: 'translateY(0)', opacity: 1 },
					'100%': { transform: 'translateY(100%)', opacity: 0 },
				},
				'land-in': {
					'0%': { transform: 'translateY(-100%)', opacity: 0 },
					'100%': { transform: 'translateY(0)', opacity: 1 },
				},
				'fade-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				'to-left': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(auto)' },
				},
				'to-right': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(auto)' },
				},
				'scaleX': {
					'0%': { transform: 'scaleX(0)' },
					'100%': { transform: 'scaleX(1)' },
				},
				'texting': {
					'0%': { clipPath: 'inset(0 100% 0 0)' },
					'100%': { clipPath: 'inset(0 0 0 0)' },
				},
			},
			colors: {
				...colors,
			},
			fontFamily: {
				Inter: ['Inter', 'sans-serif'],
				Poppins: ['Poppins', 'sans-serif'],
			},
		},
	},
	plugins: [],
};

export default config;
