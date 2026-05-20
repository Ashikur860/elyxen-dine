import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor'
            if (id.includes('react-router-dom')) return 'router'
            if (id.includes('framer-motion') || id.includes('lucide-react')) return 'ui'
            if (id.includes('recharts')) return 'charts'
            if (id.includes('@supabase')) return 'supabase'
          }
        },
      },
    },
  },
})
