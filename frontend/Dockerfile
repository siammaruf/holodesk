# Dependencies
FROM oven/bun:latest AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --no-frozen-lockfile

# Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx vite build

# Runtime
FROM node:24-alpine
WORKDIR /app

# Declare environment variables (values injected at runtime by Dokploy)
ENV VITE_API_URL=""

# Install wget for healthcheck and a static file server
RUN apk add --no-cache wget && npm install -g serve

# Copy built static files (Vite outputs to dist/)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
