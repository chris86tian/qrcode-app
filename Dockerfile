# Build stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files and server
COPY --from=builder /app/dist ./dist
COPY server.js .

# Set production environment
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]