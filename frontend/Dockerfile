# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Install dependencies using pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to host the static build output
RUN npm install -g serve@14

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/serve.json ./serve.json

# Expose port (Render sets PORT env var, default to 5173)
EXPOSE 5173

# Start the application - serve dist using serve.json for SPA rewrites
CMD ["serve", "-s", "dist", "-l", "5173", "--no-clipboard", "--config", "serve.json"]
