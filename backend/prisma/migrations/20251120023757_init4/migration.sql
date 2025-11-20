/*
  Warnings:

  - You are about to drop the `_ReplyToReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ReplyToReply" DROP CONSTRAINT "_ReplyToReply_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReplyToReply" DROP CONSTRAINT "_ReplyToReply_B_fkey";

-- DropTable
DROP TABLE "_ReplyToReply";
