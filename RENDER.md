# Deploying to Render

`render.yaml` is a [Blueprint](https://render.com/docs/blueprint-spec) that
provisions two services:

- **aw-backend** — the Dockerized Express API (`./backend/Dockerfile`)
- **aw-frontend** — the React SPA built by Vite and served as a static site

> **MongoDB:** Render has no managed MongoDB. Create a free cluster on
> [MongoDB Atlas](https://www.mongodb.com/atlas), allow access from `0.0.0.0/0`
> (or Render's IPs), and grab the `mongodb+srv://…` connection string.

## 1. Push to a Git repo

Render deploys from GitHub/GitLab. Commit everything (including `render.yaml`)
and push. `backend/.env` is gitignored — its values are supplied through
Render env vars instead (below).

## 2. Create the Blueprint

Render Dashboard → **New → Blueprint** → pick the repo. It reads `render.yaml`
and creates both services.

## 3. Fill in the secret env vars

These are marked `sync: false`, so set them in the dashboard:

**aw-backend**

| Key                     | Value                                             |
| ----------------------- | ------------------------------------------------- |
| `MONGO_URI`             | your Atlas connection string                      |
| `CLIENT_URL`            | the frontend URL (see step 4)                     |
| `SMTP_USER` / `SMTP_PASS` | Gmail address + app password                    |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary creds |

(`ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` are auto-generated.)

**aw-frontend**

| Key            | Value                                          |
| -------------- | ---------------------------------------------- |
| `VITE_API_URL` | `https://aw-backend.onrender.com/api/v1`       |

## 4. Resolve the two URLs (one-time chicken-and-egg)

The frontend needs the backend URL and the backend needs the frontend URL, but
neither exists until deployed. After the first deploy Render assigns each a URL:

1. Copy the **backend** URL → set `aw-frontend` → `VITE_API_URL` to
   `https://<backend>.onrender.com/api/v1`.
2. Copy the **frontend** URL → set `aw-backend` → `CLIENT_URL` to
   `https://<frontend>.onrender.com`.
3. Trigger a redeploy of both (the frontend must rebuild because `VITE_API_URL`
   is baked in at build time).

CORS + cookies then line up: with `NODE_ENV=production` the API issues
`Secure; SameSite=None` cookies, and `CLIENT_URL` whitelists the SPA origin.

## 5. Seed an admin (optional)

Use the backend service's **Shell** tab in the dashboard:

```bash
npm run seedAdmin
```

## Notes

- Free web services spin down after inactivity; the first request after idle is
  slow while it wakes.
- Changing `VITE_API_URL` always requires a **frontend rebuild** (Manual Deploy →
  Clear build cache & deploy) since Vite inlines env vars.
