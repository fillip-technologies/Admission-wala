# Backend — Express + Mongoose API
FROM node:20-bookworm-slim

# Small init so Node receives SIGTERM/SIGINT correctly (clean shutdown)
RUN apt-get update && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first for better layer caching.
# bcrypt ships glibc prebuilds, so no toolchain is needed on the -slim (Debian) base.
COPY package*.json ./
RUN npm ci --omit=dev

# App source
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

ENTRYPOINT ["tini", "--"]
CMD ["node", "src/server.js"]
