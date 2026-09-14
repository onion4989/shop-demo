#!/usr/bin/env bash
# Measure loader-equivalent SQL inside shop-demo-db (docker exec).
# Use when host cannot reach localhost:5433 / :3000 from the agent.
# Output: target median_ms min_ms (one line each)
set -euo pipefail

export DOCKER_HOST="${DOCKER_HOST:-unix:///mnt/wsl/docker-desktop-bind-mounts/Ubuntu/docker.sock}"
DB_CONTAINER="${DB_CONTAINER:-shop-demo-db}"

run_sql() {
  docker exec -i "$DB_CONTAINER" psql -U shop -d shop -v ON_ERROR_STOP=1 -q -t -A
}

# Returns elapsed ms for a SQL batch (one or more statements).
time_sql_ms() {
  local sql="$1"
  local out elapsed
  out=$(run_sql <<EOF
\\timing on
$sql
EOF
)
  # Sum all statement timings in the batch (not only the last COMMIT line)
  elapsed=$(printf '%s\n' "$out" | grep -oE 'Time: [0-9.]+ ms' | grep -oE '[0-9.]+' | awk '{ s+=$1 } END { if (NR==0) exit 1; printf "%d", s+0.5 }')
  if [[ -z "${elapsed}" ]]; then
    echo "timing parse failed for batch" >&2
    printf '%s\n' "$out" >&2
    echo 0
    return 1
  fi
  printf '%s\n' "$elapsed"
}

median_min() {
  sort -n | awk '
    { a[NR]=$1 }
    END {
      if (NR==0) { print "0 0"; exit }
      if (NR%2) med=a[(NR+1)/2]
      else med=int((a[NR/2]+a[NR/2+1])/2+0.5)
      min=a[1]
      print med, min
    }'
}

measure_target() {
  local target="$1"
  local sql="$2"
  local i
  time_sql_ms "$sql" >/dev/null
  {
    for i in 1 2 3 4 5; do
      time_sql_ms "$sql"
    done
  } | median_min | awk -v t="$target" '{ print t, $1, $2 }'
}

# Temp table mirrors Prisma findMany + batched relation fetches
home_batch() {
  local where_clause="$1"
  local limit_clause="${2:-}"
  cat <<EOF
BEGIN;
CREATE TEMP TABLE _prods ON COMMIT DROP AS
SELECT p."productId", p."categoryId", p.name, p.price, p.description, p.recommend
FROM "Product" p
WHERE ${where_clause}
ORDER BY p.recommend ASC
${limit_clause};
SELECT * FROM _prods;
SELECT i."productId", i."thumbnailUrl" FROM "ProductImage" i
  WHERE i."productId" IN (SELECT "productId" FROM _prods);
SELECT n."productId", n.ingredients FROM "NutritionalInfo" n
  WHERE n."productId" IN (SELECT "productId" FROM _prods);
SELECT o."productId", o."giftAvailable", o.seasonal, o."bulkPurchase",
       o."frozenDelivery", o."couponAvailable", o."shippingAvailable",
       o."reservationRequired"
  FROM "Option" o
  WHERE o."productId" IN (SELECT "productId" FROM _prods);
SELECT c."categoryId", c.name FROM "Category" c
  WHERE c."categoryId" IN (SELECT "categoryId" FROM _prods);
COMMIT;
EOF
}

GIFT_IDS="p.\"productId\" IN ('GIF00001','GIF00002','GIF00003','GIF00004','GIF00005','GIF00006')"
ITEM_IDS="p.\"productId\" IN ('CUP00001','CUP00002','CUP00003','CUP00004','CUP00005','CUP00006','CUP00007','CUP00008','ICE00001','ICE00002','TAR00001','TAR00002','TAR00003')"

measure_target home-hero "$(home_batch 'p.recommend > 0' 'LIMIT 5')"
measure_target home-gift "$(home_batch "${GIFT_IDS}")"
measure_target home-items "$(home_batch "${ITEM_IDS}")"
measure_target top-products "$(home_batch 'p.recommend > 0' 'LIMIT 10')"

# Phase 1 以降: 詳細+画像+栄養を 1 バッチ（JOIN）で取得
measure_target product-detail '
BEGIN;
SELECT p."productId", p.name, p.price, p.description, c.name, c."categoryId",
       i."thumbnailUrl", i."imageUrl_1", i."imageUrl_2", i."imageUrl_3",
       i."imageUrl_4", i."imageUrl_5", i."imageUrl_6",
       n.energy, n.protein, n.fat, n.carbohydrates, n."saltEquivalent", n.allergen
FROM "Product" p
JOIN "Category" c ON c."categoryId" = p."categoryId"
LEFT JOIN "ProductImage" i ON i."productId" = p."productId"
LEFT JOIN "NutritionalInfo" n ON n."productId" = p."productId"
WHERE p."productId" = '\''GIF00001'\'';
COMMIT;
'

measure_target cart-catalog '
BEGIN;
SELECT p."productId", p.name, p.price, c."categoryId", c.name
FROM "Product" p
JOIN "Category" c ON c."categoryId" = p."categoryId";
SELECT i."productId", i."thumbnailUrl" FROM "ProductImage" i;
SELECT o."productId", o."shippingAvailable" FROM "Option" o;
COMMIT;
'

measure_target catalog-list '
BEGIN;
SELECT p."productId", p.name, p.price, c.name
FROM "Product" p
JOIN "Category" c ON c."categoryId" = p."categoryId"
ORDER BY p.recommend ASC
LIMIT 30 OFFSET 0;
SELECT i."productId", i."thumbnailUrl" FROM "ProductImage" i
  WHERE i."productId" IN (
    SELECT p2."productId" FROM "Product" p2
    ORDER BY p2.recommend ASC
    LIMIT 30 OFFSET 0
  );
SELECT o.* FROM "Option" o
  WHERE o."productId" IN (
    SELECT p2."productId" FROM "Product" p2
    ORDER BY p2.recommend ASC
    LIMIT 30 OFFSET 0
  );
SELECT COUNT(*) FROM "Product";
COMMIT;
'
