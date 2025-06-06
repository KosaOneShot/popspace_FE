// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
    server: {
    host: true, // ← 여기 추가!
    port: 5173
  },
  resolve: { // src 폴더를 절대 경로 시작으로 설정
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
