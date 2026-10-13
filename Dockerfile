# ==============================================================================
# LastZone React + Vite Frontend - Production Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Copy website assets and source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:1.27-alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built production assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget --spider -q http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
