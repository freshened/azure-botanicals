CREATE TABLE "azure_shop_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "azure_shop_categories_slug_key" ON "azure_shop_categories"("slug");
CREATE UNIQUE INDEX "azure_shop_categories_name_key" ON "azure_shop_categories"("name");

CREATE TABLE "azure_shop_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "azure_shop_tags_slug_key" ON "azure_shop_tags"("slug");
CREATE UNIQUE INDEX "azure_shop_tags_name_key" ON "azure_shop_tags"("name");

INSERT INTO "azure_shop_categories" ("id", "slug", "name", "sort_order", "created_at") VALUES
('tax_cat_shop', 'shop', 'Shop', 0, CURRENT_TIMESTAMP),
('tax_cat_rare', 'rare-plants', 'Rare Plants', 1, CURRENT_TIMESTAMP),
('tax_cat_tissue', 'tissue-culture', 'Tissue Culture', 2, CURRENT_TIMESTAMP),
('tax_cat_sub', 'substrate-pots', 'Substrate & Pots', 3, CURRENT_TIMESTAMP),
('tax_cat_acc', 'accessories', 'Accessories', 4, CURRENT_TIMESTAMP);

INSERT INTO "azure_shop_tags" ("id", "slug", "name", "sort_order", "created_at") VALUES
('tax_tag_new', 'new', 'New', 0, CURRENT_TIMESTAMP),
('tax_tag_best', 'bestseller', 'Bestseller', 1, CURRENT_TIMESTAMP),
('tax_tag_lim', 'limited', 'Limited', 2, CURRENT_TIMESTAMP),
('tax_tag_sea', 'seasonal', 'Seasonal', 3, CURRENT_TIMESTAMP);
