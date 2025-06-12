import { Config } from 'tailwindcss'

const config: Config = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'primary': '#1890FF',
				'input-dark': '#141414',
			},
		},
	},
	plugins: [],
}
export default config
