# syntax=docker/dockerfile:1.7-labs
# Development image for web
FROM node:22-alpine AS development

# Working directory is the monorepo root (bind-mounted via docker-compose)
WORKDIR /app

# Useful tools (optional in dev)
RUN apk add --no-cache bash

ENV NODE_ENV=development

# In S1 we rely on bind mounts for source code and anonymous volumes for node_modules.
# The command is provided by docker-compose (per service).
# No files are copied at build time to keep rebuilds instant during development.
