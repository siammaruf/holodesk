# Dependencies
FROM oven/bun:latest AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --no-frozen-lockfile

# Build (Node.js needed — react-router executes server bundle to generate SPA index.html)
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx react-router build

# Runtime
FROM node:24-alpine
WORKDIR /app

# Declare environment variables (values injected at runtime by Dokploy)
ENV SERVER_API_URL=""
ENV VITE_API_URL=""

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy only the server and client builds (not node_modules from bun)
# This fixes binary incompatibility between bun-compiled and node runtime
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Install production dependencies for runtime
RUN npm install --production

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
