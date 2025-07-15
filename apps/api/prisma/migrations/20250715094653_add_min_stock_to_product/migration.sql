/*
  Warnings:

  - You are about to drop the column `minStock` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "minStock",
ADD COLUMN     "min_stock" INTEGER DEFAULT 5;
