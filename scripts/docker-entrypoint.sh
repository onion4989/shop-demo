#!/bin/sh
set -e

# Prisma schema は POSTGRES_* を参照する（Dokploy の DATABASE_URL だけだと migrate できない）
if [ -n "$POSTGRES_URL_NON_POOLING" ] || [ -n "$POSTGRES_PRISMA_URL" ]; then
  (cd /prisma-cli && npx prisma migrate deploy)
fi

exec "$@"
