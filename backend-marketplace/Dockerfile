# ── Development (hot-reload with nodemon) ───────────────────────────────────
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# ── Production: install only prod deps ──────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Production: lean runtime image ──────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./
EXPOSE 3001
CMD ["node", "src/server.js"]
