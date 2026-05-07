FROM node:20-slim AS development-dependencies-env
WORKDIR /app
# Copy package.json first to leverage Docker layer caching
COPY package.json package-lock.json* ./
# Only remove node_modules and package-lock.json if package.json has changed
RUN if [ -f package-lock.json ]; then \
        rm -rf node_modules package-lock.json; \
    fi
# Install dependencies with platform-specific binaries and ensure sourcemaps are properly generated
RUN npm install
# Set NODE_ENV to development to ensure proper sourcemap generation
ENV NODE_ENV=development
# Copy the rest of the application
COPY . .

FROM node:20-slim AS production-dependencies-env
COPY ./package.json /app/
WORKDIR /app
RUN npm install --omit=dev

FROM node:20-slim AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
# Ensure sourcemaps are generated during build
ENV GENERATE_SOURCEMAP=true
ENV NODE_ENV=development
RUN npm run build

FROM node:20-slim AS production
COPY ./package.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]