# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-alpine AS base


# Set working directory
WORKDIR /usr/src/app

# Set proper ownership
RUN chown -R node:node /usr/src/app

# ========================================
# Dependencies Stage
# ========================================
FROM base AS deps

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --omit=dev && \
    npm cache clean --force

# Set proper ownership
RUN chown -R node:node /usr/src/app

# ========================================
# Build Dependencies Stage
# ========================================
FROM base AS build-deps

# Copy package files
COPY package*.json ./

# Install all dependencies with build optimizations
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund && \
    npm cache clean --force

# Create necessary directories and set permissions
RUN chown -R node:node /usr/src/app

# ========================================
# Development Stage
# ========================================
FROM build-deps AS development

# Set environment
ENV NODE_ENV=development \
    NPM_CONFIG_LOGLEVEL=warn

# Copy source files
COPY . .

# Ensure all directories have proper permissions
RUN chown -R node:node /usr/src/app && \
    chmod -R 755 /usr/src/app

# Switch to non-root user
USER node

# Expose ports
EXPOSE 3000 9229

# Start development server
CMD [ "npm", "run", "dev" ]

# ========================================
# Production Stage
# ========================================

ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Create non-root user for security
RUN chown -R node:node /usr/src/app

# Set optimized environment variables
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=256 --no-warnings" \
    NPM_CONFIG_LOGLEVEL=silent

# Copy production dependencies from deps stage
COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
# COPY --from=deps --chown=node:node /usr/src/app/package*.json ./
# Copy the rest of the source files into the image.
COPY --chown=node:node . .

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD [ "node", "index.js" ]
