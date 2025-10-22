# Node builder stage for assets
FROM node:22 AS node-builder
WORKDIR /var/www/html
COPY package*.json pnpm-lock.yaml* ./
RUN corepack enable pnpm \
    && corepack use pnpm@10.15 \
    && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Nginx stage
FROM nginx:alpine

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built assets from node-builder stage
COPY --from=node-builder /var/www/html/public /var/www/html/public

# Create log directory
RUN mkdir -p /var/log/nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1
