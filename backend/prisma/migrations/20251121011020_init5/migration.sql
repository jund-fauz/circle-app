/*
  Warnings:

  - Made the column `thread_id` on table `Replies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "Replies_thread_id_fkey";

-- AlterTable
ALTER TABLE "Replies" ALTER COLUMN "thread_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
