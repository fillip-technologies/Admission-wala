# Deployment Guide

- **Backend** → Render (Node web service)
- **Frontend** → Hostinger (static files in `public_html`, served at the domain root)

Production URLs:
- Frontend: `https://shreeadmissiongurukul.fillipsoftware.com`
- Backend API: `https://admission-wala-e8wn.onrender.com/api/v1`

These two must stay in sync:
- The frontend calls the backend via `client/.env.production` → `VITE_API_URL`.
- The backend allows the frontend origin via CORS (`backend/src/app.js` `DEFAULT_ORIGINS` + the `CLIENT_URL` env var).

Auth works cross-site because the access token is sent as an `Authorization: Bearer`
header (stored in `localStorage`), not via cookies.

---

## 1. Backend on Render

**Service settings**
- Repository root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`  (runs `node src/server.js`)
- Node: pinned to `>=18` via `backend/package.json` `engines`.
- Health check path: `/` (returns `{ success: true }`).

**Environment variables** — set every key from `backend/.env.example` in the Render
dashboard (Environment tab). Do **not** set `PORT` (Render injects it). Make sure:
- `NODE_ENV=production`
- `CLIENT_URL=https://shreeadmissiongurukul.fillipsoftware.com`
- `MONGO_URI` points at MongoDB Atlas, and Atlas Network Access allows Render
  (allow `0.0.0.0/0`, or Render's egress IPs).
- `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` are long random strings.
- Cloudinary + SMTP creds are set (SMTP must be a Gmail **App Password**).

> **Email on Render — use Resend, not SMTP.** Render blocks outbound SMTP ports,
> so Gmail SMTP times out (`Mail server connection failed: Connection timeout`).
> The backend automatically sends via the **Resend HTTPS API** when
> `RESEND_API_KEY` is set (falling back to SMTP locally). To enable it on Render:
> 1. Create an API key at resend.com → set `RESEND_API_KEY` in Render env.
> 2. Set `RESEND_FROM` to a verified sender. For a quick test use
>    `onboarding@resend.dev`; for production, verify your domain in Resend and use
>    e.g. `no-reply@shreeadmissiongurukul.fillipsoftware.com`.
> With `RESEND_API_KEY` present, the SMTP_* vars are ignored in production.

**Redeploy:** push to the connected branch, or click "Manual Deploy" in Render.

---

## 2. Frontend on Hostinger

Hostinger shared hosting serves static files only — there is no Node runtime.
You build locally and upload the `dist/` output.

**Build**
```bash
cd client
npm install
npm run build     # outputs client/dist/
```
`vite build` automatically uses `client/.env.production` (the Render API URL and
WhatsApp number). Vite `base` is `/` because the site is served at the domain root.

**Upload**
1. In Hostinger File Manager (or FTP), open the domain's `public_html`.
2. Delete the old build (keep any unrelated files).
3. Upload **the contents of `client/dist/`** into `public_html` — not the `dist`
   folder itself. The result should be `public_html/index.html`,
   `public_html/assets/...`, and `public_html/.htaccess`.
4. `.htaccess` ships in `client/public/.htaccess` and is copied into `dist/` on
   build. It provides the SPA fallback (deep links / refresh → `index.html`) and
   long-cache headers for hashed assets. Make sure it uploads (enable "show
   hidden files" in File Manager).

**Verify**
- Load `https://shreeadmissiongurukul.fillipsoftware.com` and hard-refresh.
- Deep-link a route (e.g. `/blogs`, `/login`) and refresh — must not 404.
- Register/log in — confirm the browser calls the Render API and auth persists.

---

## 3. Changing a URL later

- **New backend URL:** update `VITE_API_URL` in `client/.env.production`, rebuild,
  re-upload.
- **New frontend domain:** add it to `CLIENT_URL` on Render (or to `DEFAULT_ORIGINS`
  in `backend/src/app.js`) and redeploy the backend, or CORS will block it.

## 4. Common pitfalls
- **CORS error in console:** the frontend origin isn't in the allowlist → fix
  `CLIENT_URL` on Render and redeploy.
- **Blank page / 404 on refresh:** `.htaccess` didn't upload, or the app was put in
  a subfolder (then Vite `base` and `.htaccess` `RewriteBase` must match the path).
- **"Failed to fetch dynamically imported module" after a deploy:** old `index.html`
  cached. The included `.htaccess` sets `index.html` to no-cache to avoid this;
  hard-refresh once.
- **API calls 404:** `VITE_API_URL` must include the `/api/v1` suffix.
