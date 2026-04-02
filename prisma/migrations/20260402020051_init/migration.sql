-- CreateTable
CREATE TABLE "azure_product_extra_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripe_product_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "azure_product_extra_images_stripe_product_id_idx" ON "azure_product_extra_images"("stripe_product_id");
