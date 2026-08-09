import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    include: ['wagmi', 'viem', '@rainbow-me/rainbowkit', '@tanstack/react-query']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src')
    }
  },
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
