# === BUILD STAGE ===
FROM node:20-slim AS builder

# Ensure OpenSSL is present for Prisma binary generation
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./
COPY turbo.json ./

# Copy packages and apps
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install ALL dependencies (including dev) to ensure tsc is available
RUN npm ci

# Build shared package
WORKDIR /app/packages/shared
RUN npm run build

# Build API application
WORKDIR /app/apps/api
RUN npm run build

# Prune devDependencies to keep the runtime node_modules lightweight
# This is done at the root level to respect workspace links
WORKDIR /app
RUN npm prune --omit=dev

# === RUNTIME STAGE ===
FROM node:20-slim

WORKDIR /app

# Install dumb-init for signal handling and openssl for Prisma native engine
RUN apt-get update && apt-get install -y dumb-init openssl && rm -rf /var/lib/apt/lists/*

# Copy root configurations and pruned node_modules (preserves workspace symlinks)
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Copy shared package (required for symlinked resolution)
COPY --from=builder --chown=node:node /app/packages/shared/package.json ./packages/shared/
COPY --from=builder --chown=node:node /app/packages/shared/dist ./packages/shared/dist

# Setup API workspace working directory
WORKDIR /app/apps/api

# Copy API built code and files
COPY --from=builder --chown=node:node /app/apps/api/package.json ./
COPY --from=builder --chown=node:node /app/apps/api/dist ./dist
# Copy schema to /app/apps/api/prisma (matches docker-compose.yml expectation)
COPY --from=builder --chown=node:node /app/apps/api/src/database/prisma ./prisma

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/apps/api/uploads && chown -R node:node /app/apps/api/uploads

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
