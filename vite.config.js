import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Saat npm run dev, permintaan /api dan /uploads diteruskan ke backend (port 4000).
const backend = process.env.VITE_PROXY_TARGET || 'http://localhost:4000'
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': backend, '/uploads': backend } },
})
