#!/bin/sh
set -e

IS_PROD=false
if [ "${NODE_ENV}" = "production" ] || [ "${MODE}" = "PROD" ]; then
  IS_PROD=true
fi

# Helper to echo only in non-production
info() {
  if [ "$IS_PROD" != "true" ]; then
    echo "$@"
  fi
}

info "Checking database connectivity..."
MAX_RETRIES=10
RETRY_COUNT=0

while ! pg_isready -h "${DATABASE_HOST:-localhost}" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USERNAME:-postgres}" -t 5 2>/dev/null; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: Database not ready after $MAX_RETRIES attempts. Exiting."
    exit 1
  fi
  info "Database not ready, waiting 3s... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 3
done

info "Database is ready."

if [ "$IS_PROD" = "true" ]; then
  node ./node_modules/typeorm/cli.js migration:run -d ./dist/config/data-source.js > /dev/null 2>&1 || {
    echo "ERROR: Database migrations failed. Exiting."
    exit 1
  }
else
  echo "Running database migrations..."
  node ./node_modules/typeorm/cli.js migration:run -d ./dist/config/data-source.js
  echo "Migrations complete."
fi

info "Starting application..."
exec node dist/main
