import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.API_PROXY_TARGET || 'http://127.0.0.1:3001';
  return {
    root: 'client',
    envDir: '..',
    plugins: [react()],
    build: { outDir: '../dist', emptyOutDir: true },
    server: {
      host: '127.0.0.1', port: Number(env.CLIENT_PORT || 5173), strictPort: true,
      proxy: { '/api': target, '/Photos': target },
    },
  };
});
