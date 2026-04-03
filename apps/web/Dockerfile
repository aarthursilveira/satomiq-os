# === BUILD STAGE ===
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=https://api-os.satomiq.com
ARG VITE_APP_NAME=SAtomiq-OS

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

# Copy workspace files
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# Install dependencies
RUN npm ci

# Build shared package first
WORKDIR /app/packages/shared
RUN npm run build

# Build web app
WORKDIR /app/apps/web
RUN npm run build

# === RUNTIME STAGE ===
FROM nginx:1.25-alpine

# Copy Nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from builder
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
