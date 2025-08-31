import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "build"
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000" // proxy API requests to your backend
    }
  }
})
