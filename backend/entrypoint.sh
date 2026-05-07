#!/bin/sh
set -e

IS_PROD=false
if [ "${NODE_ENV}" = "production" ] || [ "${MODE}" = "PROD" ]; then
  IS_PROD=true
fi

if [ "$IS_PROD" = "true" ]; then
  # Production: silent mode
  pg_isready -h "${DATABASE_HOST:-localhost}" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USERNAME:-postgres}" -t 5 > /dev/null 2>&1 || {
    echo "ERROR: Database not ready. Exiting."
    exit 1
  }

  node ./node_modules/typeorm/cli.js migration:run -d ./dist/config/data-source.js > /dev/null 2>&1 || {
    echo "ERROR: Database migrations failed. Exiting."
    exit 1
  }
else
  echo "Checking database connectivity..."
  MAX_RETRIES=10
  RETRY_COUNT=0

  while ! pg_isready -h "${DATABASE_HOST:-localhost}" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USERNAME:-postgres}" -t 5 2>/dev/null; do
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
  node ./node_modules/typeorm/cli.js migration:run -d ./dist/config/data-source.js
  echo "Migrations complete."
  echo "Starting application..."
fi

exec node dist/main
