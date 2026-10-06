FROM node:22-alpine AS builder
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# Deploy info shown in the header (no .git inside the image) — read by next.config.js
ARG DEPLOY_BY=unknown
ARG DEPLOY_AT
ARG DEPLOY_HASH
ARG DEPLOY_MSG
RUN BUILD_STANDALONE=1 pnpm build

# ---

FROM node:22-alpine AS runner
RUN apk add --no-cache tini tzdata
WORKDIR /app

ENV NODE_ENV=production \
    TZ=Asia/Ho_Chi_Minh \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
