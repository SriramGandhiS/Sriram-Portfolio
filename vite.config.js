import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    assetsInclude: ['**/*.glb'],
    resolve: {
        dedupe: ['three']
    },
    server: {
        port: 5500,
        host: '0.0.0.0',
        strictPort: true
    },
    build: {
        minify: false
    }
});
