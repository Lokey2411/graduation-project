import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		chunkSizeWarningLimit: 1500,
	},
	server: {
		proxy: {
			'/services/api': {
				// target: 'https://graduation-project-be-pearl.vercel.app',
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: false,
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	publicDir: 'public',
	assetsInclude: ['**/*.png'],
});
