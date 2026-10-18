/*
  Warnings:

  - A unique constraint covering the columns `[previousQuoteId]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "previousQuoteId" TEXT,
ADD COLUMN     "revision" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Quote_bookingId_revision_idx" ON "Quote"("bookingId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_previousQuoteId_key" ON "Quote"("previousQuoteId");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_previousQuoteId_fkey" FOREIGN KEY ("previousQuoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
