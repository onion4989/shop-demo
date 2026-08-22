INSERT INTO "Category" ("categoryId", "name")
VALUES
  ('CUP', 'カップケーキ'),
  ('ICE', 'アイスケーキ')
ON CONFLICT ("categoryId") DO NOTHING;

INSERT INTO "Product" ("productId", "name", "categoryId", "price", "description", "recommend", "updatedDate")
VALUES
  (
    'CUP00001',
    'チョコチップカップケーキ',
    'CUP',
    480,
    'チョコチップを散らした定番のカップケーキです。',
    1,
    NOW()
  ),
  (
    'CUP00002',
    'ハートチップカップケーキ',
    'CUP',
    500,
    'ハート型チップをのせたかわいいカップケーキです。',
    2,
    NOW()
  ),
  (
    'CUP00003',
    'クリームカップケーキ',
    'CUP',
    480,
    'たっぷりのクリームを絞ったカップケーキです。',
    3,
    NOW()
  ),
  (
    'CUP00004',
    'ハーブミントカップケーキ',
    'CUP',
    520,
    'ミントの香りが爽やかなカップケーキです。',
    4,
    NOW()
  ),
  (
    'CUP00005',
    'さくらカップケーキ',
    'CUP',
    540,
    '桜の風味をいかした季節のカップケーキです。',
    5,
    NOW()
  ),
  (
    'CUP00006',
    'アーモンドカップケーキ',
    'CUP',
    520,
    'アーモンドの香ばしさが楽しめるカップケーキです。',
    6,
    NOW()
  ),
  (
    'CUP00007',
    'ミルクバニラカップケーキ',
    'CUP',
    480,
    'ミルクとバニラのやさしい味わいのカップケーキです。',
    7,
    NOW()
  ),
  (
    'ICE00001',
    'アイスクリームバウム',
    'ICE',
    580,
    'バウムクーヘンとアイスを組み合わせたケーキです。',
    8,
    NOW()
  )
ON CONFLICT ("productId") DO NOTHING;

INSERT INTO "ProductImage" ("productId", "thumbnailUrl")
VALUES
  ('CUP00001', 'cup0001_item_chocolate-chip-cupcake_thumbnail.jpg'),
  ('CUP00002', 'cup0002_item_heart-chip-cupcake_thumbnail.jpg'),
  ('CUP00003', 'cup0003_item_cream-cupcake_thumbnail.jpg'),
  ('CUP00004', 'cup0004_item_herbal-mint-cupcake_thumbnail.jpg'),
  ('CUP00005', 'cup0005_item_sakura-cupcake_thumbnail.jpg'),
  ('CUP00006', 'cup0006_item_almond-cupcake_thumbnail.jpg'),
  ('CUP00007', 'cup0007_item_milk-vanilla-cupcake_thumbnail.jpg'),
  ('ICE00001', 'ice0001_item_ice-cream-baum_thumbnail.jpg')
ON CONFLICT ("productId") DO NOTHING;

INSERT INTO "Option" ("productId", "giftAvailable", "seasonal", "bulkPurchase", "frozenDelivery", "couponAvailable")
VALUES
  ('CUP00001', true, false, true, false, true),
  ('CUP00002', false, true, false, true, false),
  ('CUP00003', true, false, false, false, true),
  ('CUP00004', false, false, true, true, false),
  ('CUP00005', true, true, false, false, true),
  ('CUP00006', false, true, true, false, false),
  ('CUP00007', true, false, false, true, true),
  ('ICE00001', false, false, true, true, true)
ON CONFLICT ("productId") DO NOTHING;
