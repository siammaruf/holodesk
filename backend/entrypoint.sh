#!/bin/sh
set -e

echo "Checking database connectivity..."
MAX_RETRIES=10
RETRY_COUNT=0

while ! pg_isready -h "$POSTGRES_HOST" -p "${POSTGRES_PORT:-5432}" -U "$POSTGRES_USER" -t 5 2>/dev/null; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: Database not ready after $MAX_RETRIES attempts. Exiting."
    exit 1
  fi
  echo "Database not ready, waiting 3s... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 3
done

echo "Database is ready."

echo "Running database migrations..."
node ./node_modules/typeorm/cli.js migration:run -d ./dist/config/db.config.js
echo "Migrations complete."

echo "Starting application..."
exec node dist/main