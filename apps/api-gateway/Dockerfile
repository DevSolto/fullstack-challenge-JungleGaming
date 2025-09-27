# syntax=docker/dockerfile:1.7-labs
FROM node:22-alpine

WORKDIR /app

# utilidades e pnpm via Corepack
RUN apk add --no-cache bash && corepack enable
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# dica: o comando real virá do docker-compose
CMD ["sh", "-lc", "pnpm -v && sleep infinity"]
