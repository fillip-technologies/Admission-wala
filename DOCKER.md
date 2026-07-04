# Running with Docker

Three services are defined in `docker-compose.yml`:

| Service    | Image / Build   | Host port | Notes                                  |
| ---------- | --------------- | --------- | -------------------------------------- |
| `mongo`    | `mongo:7`       | 27017     | Data persisted in the `mongo_data` volume |
| `backend`  | `./backend`     | 3000      | Express API (`/api/v1`)                |
| `frontend` | `./client`      | 8080      | React SPA built by Vite, served by nginx |

## Prerequisites

`backend/.env` must exist (it holds JWT secrets, SMTP and Cloudinary creds).
Compose loads it and then overrides `MONGO_URI` and `CLIENT_URL` for container
networking, so you don't need to edit it.

## Start everything

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:8080
- Backend health: http://localhost:3000

## Configuration

Two values can be overridden at build/run time (defaults shown):

```bash
# URL the browser uses to reach the API (baked into the SPA at build time)
VITE_API_URL=http://localhost:3000/api/v1

# Origin the backend allows via CORS (should match where the frontend is served)
CLIENT_URL=http://localhost:8080
```

Set them inline or in a root `.env` file read by Compose, e.g.:

```bash
VITE_API_URL=https://api.example.com/api/v1 CLIENT_URL=https://example.com docker compose up --build
```

> `VITE_API_URL` is a **build-time** arg — change it and rebuild the frontend
> image (`docker compose build frontend`) for it to take effect.

## Seed an admin user

```bash
docker compose exec backend npm run seedAdmin
```

## Stop / clean up

```bash
docker compose down          # stop containers
docker compose down -v       # also delete the Mongo data volume
```
