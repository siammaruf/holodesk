#!/bin/sh
set -e

# Generate runtime environment config from Dokploy/Docker env vars
cat <<EOF > /app/dist/env-config.js
window.__RUNTIME_CONFIG__ = {
  VITE_API_URL: "${VITE_API_URL:-}"
};
EOF

# Debug: Print environment variables
echo "=== Environment Variables ==="
echo "VITE_API_URL=${VITE_API_URL:-<not set>}"
echo "=== Starting Static File Server ==="

# Serve static files from Vite build output
exec serve -s /app/dist -l 3000