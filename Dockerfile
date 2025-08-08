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

# Install Node.js for health check API with security updates
RUN apk add --no-cache --update nodejs npm && \
    apk upgrade

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper ownership for nginx files
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown appuser:appgroup /etc/nginx/nginx.conf

# Create a simple health check server
RUN mkdir -p /app && chown -R appuser:appgroup /app
WORKDIR /app

# Create package.json for health check server
RUN echo '{"type": "module"}' > package.json && \
    chown appuser:appgroup package.json

# Create simple health check server with secure binding
RUN printf 'import { createServer } from "http";\nconsole.log("Health check server starting...");\nconst server = createServer((req, res) => {\n  console.log(`Received request: ${req.method} ${req.url}`);\n  if (req.url === "/health-check") {\n    res.writeHead(200, { "Content-Type": "application/json" });\n    const response = { status: "ok", timestamp: new Date().toISOString() };\n    res.end(JSON.stringify(response));\n    console.log("Health check response sent:", response);\n  } else {\n    res.writeHead(404);\n    res.end("Not Found");\n    console.log("404 response sent for:", req.url);\n  }\n});\nserver.listen(3001, "127.0.0.1", () => {\n  console.log("Health check server running on 127.0.0.1:3001");\n});\n' > health-server.js && \
    chown appuser:appgroup health-server.js

# Create startup script
RUN printf '#!/bin/sh\nset -e\necho "Starting health check server..."\ncd /app\nnode health-server.js &\nHEALTH_PID=$!\necho "Health check server started with PID $HEALTH_PID"\nsleep 2\necho "Starting nginx..."\nexec nginx -g "daemon off;"\n' > /start.sh && \
    chmod +x /start.sh && \
    chown appuser:appgroup /start.sh

# Switch to non-root user
USER appuser

EXPOSE 80 3001

# Override nginx entrypoint
ENTRYPOINT []
CMD ["/start.sh"]