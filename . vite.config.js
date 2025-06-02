// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
    server: {
    host: true, // ← 여기 추가!
    port: 5173
  }
});
