import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev proxy: the browser only talks to localhost:5173, and Vite forwards /api
// calls to the Render backend server-side. This keeps the auth cookie
// first-party (localhost), avoiding third-party-cookie blocking that breaks
// a local frontend talking directly to an onrender.com backend.
const BACKEND = 'https://api.shreeadmissiongurukul.com'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: BACKEND,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
        // Render free tier cold-starts on idle; give it time before giving up.
        timeout: 60000,
        proxyTimeout: 60000,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.warn('[vite proxy] backend unreachable/slow:', err.code || err.message)
            if (res && !res.headersSent && res.writeHead) {
              res.writeHead(504, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Backend waking up, please retry.' }))
            }
          })
        },
      },
    },
  },
})
