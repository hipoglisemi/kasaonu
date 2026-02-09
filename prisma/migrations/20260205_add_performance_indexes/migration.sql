-- Add performance indexes for campaigns table
CREATE INDEX IF NOT EXISTS "idx_campaigns_is_active" ON "campaigns"("is_active");
CREATE INDEX IF NOT EXISTS "idx_campaigns_end_date" ON "campaigns"("end_date");
CREATE INDEX IF NOT EXISTS "idx_campaigns_card_id" ON "campaigns"("card_id");
CREATE INDEX IF NOT EXISTS "idx_campaigns_sector_id" ON "campaigns"("sector_id");

-- Add index for search optimization
CREATE INDEX IF NOT EXISTS "idx_campaigns_title" ON "campaigns"("title");

-- Add indexes for related tables
CREATE INDEX IF NOT EXISTS "idx_cards_bank_id" ON "cards"("bank_id");
CREATE INDEX IF NOT EXISTS "idx_cards_is_active" ON "cards"("is_active");

CREATE INDEX IF NOT EXISTS "idx_campaign_brands_campaign_id" ON "campaign_brands"("campaign_id");
CREATE INDEX IF NOT EXISTS "idx_campaign_brands_brand_id" ON "campaign_brands"("brand_id");

CREATE INDEX IF NOT EXISTS "idx_brands_sector_id" ON "brands"("sector_id");
CREATE INDEX IF NOT EXISTS "idx_brands_is_active" ON "brands"("is_active");

-- Add index for search logs
CREATE INDEX IF NOT EXISTS "idx_search_logs_searched_at" ON "search_logs"("searched_at");
