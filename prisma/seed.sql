INSERT INTO "Category" ("categoryId", "name")
VALUES
  ('CUP', 'カップケーキ'),
  ('ICE', 'アイスケーキ'),
  ('GIF', 'ギフト')
ON CONFLICT ("categoryId") DO NOTHING;

INSERT INTO "Product" ("productId", "name", "categoryId", "price", "description", "recommend", "updatedDate")
VALUES
  (
    'CUP00001',
    'チョコチップカップケーキ',
    'CUP',
    480,
    'チョコチップを散らした定番のカップケーキです。しっとり生地にコクのあるチョコを散りばめました。やさしい甘さとカリッとした食感がアクセント。世代を問わず愛される味わいで手土産にも最適です。',
    1,
    NOW()
  ),
  (
    'CUP00002',
    'ハートチップカップケーキ',
    'CUP',
    500,
    'ハート型チップをのせたかわいいカップケーキです。愛らしいハート型チップがテーブルを華やかに彩ります。上品な甘さと楽しい食感が魅力で、お祝いやプチギフトにもぴったりなキュートな一品です。',
    2,
    NOW()
  ),
  (
    'CUP00003',
    'クリームカップケーキ',
    'CUP',
    480,
    'たっぷりのクリームを絞ったカップケーキです。ふわふわ生地に濃厚でまろやかな特製クリームをデコレーションしました。甘さ控えめで重たくならず、自分へのご褒美やおうちカフェにぴったりです。',
    3,
    NOW()
  ),
  (
    'CUP00004',
    'ハーブミントカップケーキ',
    'CUP',
    520,
    'ミントの香りが爽やかなカップケーキです。清涼感が心地よく抜け、後味すっきりに仕立てました。甘さ控えめで気分転換に最適。甘すぎるスイーツが苦手な方にもおすすめの軽やかな味わいです。',
    4,
    NOW()
  ),
  (
    'CUP00005',
    'さくらカップケーキ',
    'CUP',
    540,
    '桜の風味をいかした季節のカップケーキです。ほんのりピンクの生地から桜の香りとほのかな塩気が漂う春らしい味わい。上品な甘塩っぱさがお花見や季節の贈り物にもぴったりな限定品です。',
    5,
    NOW()
  ),
  (
    'CUP00006',
    'アーモンドカップケーキ',
    'CUP',
    520,
    'アーモンドの香ばしさが楽しめるカップケーキです。ローストアーモンドの風味とザクザク食感がクセになる美味しさ。ナッツの深いコクが口いっぱいに広がり、コーヒーのお供に最適です。',
    6,
    NOW()
  ),
  (
    'CUP00007',
    'ミルクバニラカップケーキ',
    'CUP',
    480,
    'ミルクとバニラのやさしい味わいのカップケーキです。ミルクのコクとバニラの豊かな香りを閉じ込めふんわり焼き上げました。素朴で上品な甘さは世代を問わず親しまれ、おやつにぴったりです。',
    7,
    NOW()
  ),
  (
    'ICE00001',
    'アイスクリームバウム',
    'ICE',
    580,
    'バウムクーヘンとアイスを組み合わせたケーキです。しっとりバウムの中に濃厚アイスを詰め込みました。生地とひんやりとろけるアイスが合わさる新感覚の食感で、特別な日のデザートに最適です。',
    8,
    NOW()
  )
ON CONFLICT ("productId") DO UPDATE SET
  description = EXCLUDED.description,
  "updatedDate" = NOW();

INSERT INTO "Product" ("productId", "name", "categoryId", "price", "description", "recommend", "updatedDate")
VALUES
  (
    'GIF00001',
    'バラエティータルト 16種類',
    'GIF',
    5600,
    'フルーツやチョコなど多彩な味わいが楽しめる特製タルトの詰め合わせ。サクサク生地と厳選素材が織りなす至福の美味しさです。大切な方へのギフトや、贅沢なティータイムにどうぞ。',
    0,
    NOW()
  ),
  (
    'GIF00002',
    '木イチゴの豪華ホールケーキ',
    'GIF',
    8500,
    '真っ赤なジュレとフレッシュなイチゴを華やかに飾った特製フレジエ。断面に並ぶイチゴとまろやかなクリーム、底のクッキー生地が美しい層をなします。特別な日を上品に彩る、贅沢な味わいのホールケーキです。',
    0,
    NOW()
  ),
  (
    'GIF00003',
    'マカロン 8種',
    'GIF',
    3600,
    'カラフルで愛らしい見た目が目を惹く極上マカロンの詰め合わせ。外はさっくり、中はしっとりとしたコックに濃厚なクリームを贅沢にサンドしました。ティータイムやギフトに華やかさと笑顔を添える逸品です。',
    0,
    NOW()
  ),
  (
    'GIF00004',
    'プレミアムアイスクリームケーキ',
    'GIF',
    9200,
    '豪華なギフトボックスでお届けするプレミアムアイスクリームケーキ。ベリーを飾った華やかな2段ケーキは、お誕生日や特別な記念日にぴったりです。ひんやり贅沢な味わいで、至福のひとときを贈ります。',
    0,
    NOW()
  ),
  (
    'GIF00005',
    'カップケーキ 5種類',
    'GIF',
    2650,
    'ずらりと並んだ姿が可愛らしい、バラエティ豊かなミニカップケーキのセット。抹茶やベリー、チョコなど素材の味わいを生かした多彩なフレーバーを楽しめます。パーティーや贈り物、特別なティータイムにどうぞ。',
    0,
    NOW()
  ),
  (
    'GIF00006',
    'フルーツタルト 3種類',
    'GIF',
    980,
    'ギフトボックスに並ぶ、彩り豊かなフルーツタルト3種。オレンジやベリーなど旬の果実を、サクサクのタルト生地に贅沢に盛り付けました。小さなお祝いにも、自分へのご褒美にもぴったりの一箱です。',
    0,
    NOW()
  )
ON CONFLICT ("productId") DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  "categoryId" = EXCLUDED."categoryId",
  recommend = EXCLUDED.recommend,
  "updatedDate" = NOW();

INSERT INTO "ProductImage" ("productId", "thumbnailUrl")
VALUES
  ('CUP00001', 'pages/top/ranking/photos/Ranking_CUP00001_chocolate-chip.jpg'),
  ('CUP00002', 'pages/top/ranking/photos/Ranking_CUP00002_heart-chip.jpg'),
  ('CUP00003', 'pages/top/ranking/photos/Ranking_CUP00003_cream.jpg'),
  ('CUP00004', 'pages/top/ranking/photos/Ranking_CUP00004_herb-mint.jpg'),
  ('CUP00005', 'pages/top/ranking/photos/Ranking_CUP00005_sakura.jpg'),
  ('CUP00006', 'pages/top/ranking/photos/Ranking_CUP00006_almond.jpg'),
  ('CUP00007', 'pages/top/ranking/photos/Ranking_CUP00007_milk-vanilla.jpg'),
  ('ICE00001', 'pages/top/ranking/photos/Ranking_ICE00001_ice-cream-baum.jpg'),
  ('GIF00001', 'pages/top/gift/photos/Gift_Waffles.jpg'),
  ('GIF00002', 'pages/top/gift/photos/Gift_WholeCake.jpg'),
  ('GIF00003', 'pages/top/gift/photos/Gift_Macaron.jpg'),
  ('GIF00004', 'pages/top/gift/photos/Gift_WholeCake_Presents.jpg'),
  ('GIF00005', 'pages/top/gift/photos/Gift_5CupCake.jpg'),
  ('GIF00006', 'pages/top/gift/photos/Gift_3FruitTarts.jpg')
ON CONFLICT ("productId") DO UPDATE SET
  "thumbnailUrl" = EXCLUDED."thumbnailUrl";

INSERT INTO "Option" ("productId", "giftAvailable", "seasonal", "bulkPurchase", "frozenDelivery", "couponAvailable", "shippingAvailable", "reservationRequired")
VALUES
  ('CUP00001', true, false, true, false, true, false, false),
  ('CUP00002', false, true, false, true, false, false, false),
  ('CUP00003', true, false, false, false, true, false, false),
  ('CUP00004', false, false, true, true, false, false, false),
  ('CUP00005', true, true, false, false, true, false, false),
  ('CUP00006', false, true, true, false, false, false, false),
  ('CUP00007', true, false, false, true, true, false, false),
  ('ICE00001', false, false, true, true, true, false, false),
  ('GIF00001', true, false, false, false, true, true, false),
  ('GIF00002', true, false, false, false, false, true, true),
  ('GIF00003', true, false, false, false, false, true, false),
  ('GIF00004', true, false, false, true, false, true, true),
  ('GIF00005', true, false, false, false, false, true, false),
  ('GIF00006', true, false, false, false, false, true, false)
ON CONFLICT ("productId") DO UPDATE SET
  "giftAvailable" = EXCLUDED."giftAvailable",
  seasonal = EXCLUDED.seasonal,
  "bulkPurchase" = EXCLUDED."bulkPurchase",
  "frozenDelivery" = EXCLUDED."frozenDelivery",
  "couponAvailable" = EXCLUDED."couponAvailable",
  "shippingAvailable" = EXCLUDED."shippingAvailable",
  "reservationRequired" = EXCLUDED."reservationRequired";

INSERT INTO "NutritionalInfo" ("productId", "ingredients")
VALUES
  ('CUP00001', '小麦粉、砂糖、全卵、バター、チョコレート、食塩／膨張剤、乳化剤、香料、（一部に小麦・卵・乳成分を含む）'),
  ('CUP00002', '小麦粉、砂糖、全卵、マーガリン、チョコ、食塩／膨張剤、乳化剤、着色料、香料、（一部に小麦・卵・乳成分を含む）'),
  ('CUP00003', '生クリーム、小麦粉、砂糖、全卵、バター、牛乳、食塩／膨張剤、乳化剤、香料、（一部に小麦・卵・乳成分を含む）'),
  ('CUP00004', '小麦粉、砂糖、全卵、バター、ミントソース／膨張剤、着色料、香料、（一部に小麦・卵・乳成分を含む）'),
  ('CUP00005', '小麦粉、砂糖、全卵、バター、桜葉ペースト／膨張剤、着色料、香料、（一部に小麦・卵・乳成分を含む）'),
  ('CUP00006', '小麦粉、アーモンド、砂糖、全卵、バター、食塩／膨張剤、香料、（一部に小麦・卵・乳成分・アーモンドを含む）'),
  ('CUP00007', '小麦粉、砂糖、全卵、牛乳、バター、練乳、バニラペースト／膨張剤、香料、（一部に小麦・卵・乳成分を含む）'),
  ('ICE00001', 'バニラアイス、小麦粉、砂糖、全卵、バター／トレハロース、膨張剤、乳化剤、香料、（一部に小麦・卵・乳成分を含む）'),
  ('GIF00001', '小麦粉、バター（またはマーガリン）、砂糖、卵、カスタードクリーム、アーモンドクリーム、生クリーム、チーズなど'),
  ('GIF00002', '小麦粉、バター（またはマーガリン）、砂糖、卵、カスタードクリーム、アーモンドクリーム、生クリーム、チーズなど'),
  ('GIF00003', '小麦粉、バター（またはマーガリン）、砂糖、卵、カスタードクリーム、アーモンドクリーム、生クリーム、チーズなど'),
  ('GIF00004', '小麦粉、バター（またはマーガリン）、砂糖、卵、カスタードクリーム、アーモンドクリーム、生クリーム、チーズなど'),
  ('GIF00005', '小麦粉、バター（またはマーガリン）、砂糖、卵、カスタードクリーム、アーモンドクリーム、生クリーム、チーズなど'),
  ('GIF00006', '小麦粉、バター（またはマーガリン）、砂糖、卵、カスタードクリーム、アーモンドクリーム、生クリーム、チーズなど')
ON CONFLICT ("productId") DO UPDATE SET
  ingredients = EXCLUDED.ingredients;
