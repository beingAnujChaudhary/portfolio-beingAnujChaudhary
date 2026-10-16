import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        landing: resolve(import.meta.dirname, 'index.html'),
        chapter1: resolve(import.meta.dirname, 'menschen-a1-1/index.html'),
        chapter2: resolve(import.meta.dirname, 'menschen-a1-1/chapter-2.html'),
        chapter3: resolve(import.meta.dirname, 'menschen-a1-1/chapter-3.html'),
        chapter4: resolve(import.meta.dirname, 'menschen-a1-1/chapter-4.html'),
        notes: resolve(import.meta.dirname, 'german-a1-notes/index.html')
      }
    }
  }
});
