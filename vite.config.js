import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        // Externalize backend dependencies that shouldn't be bundled
        'bcrypt',
        'better-sqlite3',
        'cors',
        'csv-writer',
        'express',
        'jsonwebtoken',
        'multer',
        'node-cron',
        'resend',
        'socket.io',
        'xlsx'
      ]
    }
  },
  optimizeDeps: {
    exclude: ['bcrypt', 'better-sqlite3', 'express', 'socket.io']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
