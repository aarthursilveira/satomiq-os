# === BUILD STAGE ===
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace files
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install dependencies
RUN npm ci --omit=dev

# Build TypeScript
WORKDIR /app/apps/api
RUN npm run build

# === RUNTIME STAGE ===
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# The 'node' user already exists in node:20-alpine image

# Copy built application from builder
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/api/dist ./dist
COPY --from=builder --chown=node:node /app/apps/api/package.json ./package.json

# Copy Prisma schema and migrations
COPY --from=builder --chown=node:node /app/apps/api/src/database/prisma ./prisma

# Switch to non-root user
USER node

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
