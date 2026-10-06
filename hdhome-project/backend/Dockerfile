# HDHOME Backend - Node.js + Express
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests trước để tận dụng cache
COPY package.json ./

# Cài dependencies (production only để nhỏ image)
RUN npm install --omit=dev

# Copy source code
COPY server.js ./
COPY src ./src
COPY database ./database

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
