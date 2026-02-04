-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "banks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "card_type" TEXT,
    "annual_fee" DECIMAL(10,2),
    "application_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon_name" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "sector_id" INTEGER NOT NULL,
    "aliases" TEXT[],
    "logo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "card_id" INTEGER NOT NULL,
    "sector_id" INTEGER,
    "title" TEXT NOT NULL,
    "reward_text" TEXT NOT NULL,
    "reward_value" DECIMAL(10,2),
    "reward_type" TEXT,
    "details_text" TEXT,
    "conditions_text" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "tracking_url" TEXT,
    "affiliate_network" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "embedding" vector(1536),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_brands" (
    "campaign_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,

    CONSTRAINT "campaign_brands_pkey" PRIMARY KEY ("campaign_id","brand_id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fingerprint" TEXT NOT NULL,
    "saved_cards" INTEGER[],
    "last_search_query" TEXT,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_logs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "session_id" UUID,
    "query" TEXT NOT NULL,
    "result_count" INTEGER,
    "clicked_campaign_id" UUID,
    "searched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missing_searches" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "search_count" INTEGER NOT NULL DEFAULT 1,
    "last_searched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suggested_sector_id" INTEGER,
    "is_resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "missing_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banks_slug_key" ON "banks"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cards_slug_key" ON "cards"("slug");

-- CreateIndex
CREATE INDEX "cards_bank_id_idx" ON "cards"("bank_id");

-- CreateIndex
CREATE UNIQUE INDEX "sectors_slug_key" ON "sectors"("slug");

-- CreateIndex
CREATE INDEX "brands_sector_id_idx" ON "brands"("sector_id");

-- CreateIndex
CREATE INDEX "campaigns_card_id_idx" ON "campaigns"("card_id");

-- CreateIndex
CREATE INDEX "campaigns_sector_id_idx" ON "campaigns"("sector_id");

-- CreateIndex
CREATE INDEX "campaigns_start_date_end_date_idx" ON "campaigns"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "campaign_brands_brand_id_idx" ON "campaign_brands"("brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_fingerprint_key" ON "user_sessions"("fingerprint");

-- CreateIndex
CREATE INDEX "search_logs_query_idx" ON "search_logs"("query");

-- CreateIndex
CREATE INDEX "search_logs_searched_at_idx" ON "search_logs"("searched_at");

-- CreateIndex
CREATE UNIQUE INDEX "missing_searches_query_key" ON "missing_searches"("query");

-- CreateIndex
CREATE INDEX "missing_searches_query_idx" ON "missing_searches"("query");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_brands" ADD CONSTRAINT "campaign_brands_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_brands" ADD CONSTRAINT "campaign_brands_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "user_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_clicked_campaign_id_fkey" FOREIGN KEY ("clicked_campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
