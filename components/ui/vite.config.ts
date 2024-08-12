import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr()],
	css: {
		modules: {
			generateScopedName: '[folder]_[local]__[hash:base64:5]',
		},
	},
	optimizeDeps: {
		include: ['@evraz/ui-kit'],
	},
	server: {
		proxy: {
			'/api': {
				target:
					'https://energy-management-ural-9505-dev.apps.osd.ural.evraz.com/',
				changeOrigin: true,
			},
		},
	},
});
