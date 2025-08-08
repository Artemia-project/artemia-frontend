# Multi-stage build for Vite React application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Vite application
RUN npm run build

# Production image with nginx to serve static files
FROM nginx:alpine AS runner

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup



# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories with proper permissions for nginx
RUN mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp \
             /var/log/nginx \
             /var/run/nginx && \
    chown -R appuser:appgroup /var/cache/nginx \
                              /var/log/nginx \
                              /var/run/nginx \
                              /usr/share/nginx/html && \
    chown appuser:appgroup /etc/nginx/nginx.conf && \
    chmod 755 /var/cache/nginx \
              /var/log/nginx \
              /var/run/nginx







# Switch to non-root user
USER appuser

EXPOSE 80

# Override nginx entrypoint
ENTRYPOINT []
COPY start.sh /start.sh
CMD ["/start.sh"]