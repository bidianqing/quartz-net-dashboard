import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/quartz': {
        target: 'http://localhost:5054',
        changeOrigin: true
      }
    }
  },
  resolve:{
    alias:{
      '@':path.resolve(__dirname, "src")
    }
  },
  plugins: [vue()],
})
