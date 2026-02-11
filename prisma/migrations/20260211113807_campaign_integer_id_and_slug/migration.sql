/*
  Warnings:

  - The primary key for the `campaign_brands` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `campaigns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `campaigns` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clicked_campaign_id` column on the `search_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `campaigns` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `campaign_id` on the `campaign_brands` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `slug` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "campaign_brands" DROP CONSTRAINT "campaign_brands_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "search_logs" DROP CONSTRAINT "search_logs_clicked_campaign_id_fkey";

-- AlterTable
ALTER TABLE "campaign_brands" DROP CONSTRAINT "campaign_brands_pkey",
DROP COLUMN "campaign_id",
ADD COLUMN     "campaign_id" INTEGER NOT NULL,
ADD CONSTRAINT "campaign_brands_pkey" PRIMARY KEY ("campaign_id", "brand_id");

-- AlterTable
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_pkey",
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "search_logs" DROP COLUMN "clicked_campaign_id",
ADD COLUMN     "clicked_campaign_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_slug_key" ON "campaigns"("slug");

-- AddForeignKey
ALTER TABLE "campaign_brands" ADD CONSTRAINT "campaign_brands_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_clicked_campaign_id_fkey" FOREIGN KEY ("clicked_campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
