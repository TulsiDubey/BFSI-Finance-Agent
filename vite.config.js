import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: true
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          api: ['./src/lib/api.js']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['src/lib/api.js'],
    force: true
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
}) 