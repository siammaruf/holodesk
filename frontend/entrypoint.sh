#!/bin/sh
set -e

# Generate runtime environment config from Dokploy/Docker env vars
cat <<EOF > /app/build/client/env-config.js
window.__RUNTIME_CONFIG__ = {
  VITE_API_URL: "${VITE_API_URL:-}"
};
EOF

# Debug: Print environment variables
echo "=== Environment Variables ==="
# echo "SERVER_API_URL=${SERVER_API_URL:-<not set>}"
echo "VITE_API_URL=${VITE_API_URL:-<not set>}"
echo "=== Starting SSR Server ==="

# Use react-router-serve for SSR (reads from build/server/index.js)
# Pass env vars explicitly to ensure they're available in the Node.js process
# exec env SERVER_API_URL="${SERVER_API_URL}" VITE_API_URL="${VITE_API_URL}" npx react-router-serve ./build/server/index.js
exec env VITE_API_URL="${VITE_API_URL}" npx react-router-serve ./build/server/index.js