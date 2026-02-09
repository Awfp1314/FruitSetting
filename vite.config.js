import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库单独打包
          'react-vendor': ['react', 'react-dom'],
          // 将图标库单独打包
          icons: ['lucide-react'],
          // 将农历库单独打包
          lunar: ['lunar-javascript'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
