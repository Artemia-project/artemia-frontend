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

# Install Node.js for health check API
RUN apk add --no-cache nodejs npm

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a simple health check server
RUN mkdir -p /app
WORKDIR /app

# Create package.json for health check server
RUN echo '{"type": "module"}' > package.json

# Create simple health check server
RUN echo 'import { createServer } from "http";\n\
const server = createServer((req, res) => {\n\
  if (req.url === "/health-check") {\n\
    res.writeHead(200, { "Content-Type": "application/json" });\n\
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));\n\
  } else {\n\
    res.writeHead(404);\n\
    res.end("Not Found");\n\
  }\n\
});\n\
server.listen(3001, () => console.log("Health check server running on port 3001"));' > health-server.js

# Create startup script
RUN echo '#!/bin/sh\n\
node /app/health-server.js &\n\
nginx -g "daemon off;"' > /start.sh && chmod +x /start.sh

EXPOSE 80 3001

CMD ["/start.sh"]