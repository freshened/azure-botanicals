CREATE TABLE "azure_product_inventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripe_product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "azure_product_inventory_stripe_product_id_key" ON "azure_product_inventory"("stripe_product_id");

CREATE TABLE "azure_inventory_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payment_intent_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "azure_inventory_reservations_payment_intent_id_key" ON "azure_inventory_reservations"("payment_intent_id");
