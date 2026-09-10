# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# next build / prisma generate 用のダミー（本番接続は不要）
ENV POSTGRES_PRISMA_URL="postgresql://postgres:postgres@localhost:5432/build_dummy"
ENV POSTGRES_URL_NON_POOLING="postgresql://postgres:postgres@localhost:5432/build_dummy"
RUN npm run build

# migrate deploy 用に Prisma CLI を隔離保持
FROM base AS prisma
RUN apk add --no-cache libc6-compat
WORKDIR /prisma-cli
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=prisma /prisma-cli /prisma-cli
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
