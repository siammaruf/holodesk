FROM oven/bun:latest AS builder

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json bun.lock* package-lock.json* ./
RUN bun install
COPY . .
RUN bun run build

FROM node:24.14.0-slim

RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/i18n ./src/i18n
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/package.json ./package.json

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh && mkdir -p uploads

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/api/health || exit 1

ENTRYPOINT ["./entrypoint.sh"]