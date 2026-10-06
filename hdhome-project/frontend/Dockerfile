# HDHOME Frontend - React + Vite (SPA)
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies (use npm if lock present, else pnpm)
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    elif [ -f pnpm-lock.yaml ]; then \
      corepack enable && corepack prepare pnpm@9 --activate && \
      pnpm install --frozen-lockfile; \
    else \
      npm install --no-audit --no-fund; \
    fi

# Copy source code
COPY . .

# Build the application (tsc + vite)
RUN npm run build || npx vite build

# Production stage - serve static files
FROM node:20-alpine

WORKDIR /app

# Install serve to host the static build output (SPA mode)
RUN npm install -g serve@14

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port (Render sets PORT env var, default to 5173)
EXPOSE 5173

# Start: serve dist with --single flag for SPA routing (rewrite all -> index.html)
CMD ["serve", "-s", "dist", "-l", "5173", "--no-clipboard", "--single"]