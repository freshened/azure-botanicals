CREATE TABLE "azure_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payment_intent_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount_total" INTEGER NOT NULL,
    "customer_email" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "azure_orders_payment_intent_id_key" ON "azure_orders"("payment_intent_id");

CREATE TABLE "azure_order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "stripe_product_id" TEXT NOT NULL,
    "stripe_price_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    CONSTRAINT "azure_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "azure_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "azure_order_items_order_id_idx" ON "azure_order_items"("order_id");
