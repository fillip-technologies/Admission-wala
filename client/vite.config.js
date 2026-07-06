import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev proxy: the browser only talks to localhost:5173, and Vite forwards /api
// calls to the Render backend server-side. This keeps the auth cookie
// first-party (localhost), avoiding third-party-cookie blocking that breaks
// a local frontend talking directly to an onrender.com backend.
const BACKEND = 'https://admission-wala-e8wn.onrender.com'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: BACKEND,
        changeOrigin: true,   
        secure: true,         
        cookieDomainRewrite: 'localhost', 
      },
    },
  },
})
