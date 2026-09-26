# Render sets PORT env var, backend code listens on it.
# Default also set so local Docker still works on 5000.

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Install dependencies using pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile --prod

# Copy source code
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./
COPY --from=builder /app/uploads ./uploads

# Ensure uploads dir exists (also covers Render persistent disk mount)
RUN mkdir -p /var/data/uploads

# Expose port (Render overrides PORT env var)
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
