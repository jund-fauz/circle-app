-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_thread_id_fkey";

-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "Replies_thread_id_fkey";

-- AlterTable
ALTER TABLE "Likes" ADD COLUMN     "reply_id" INTEGER,
ALTER COLUMN "thread_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Replies" ALTER COLUMN "thread_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_ReplyToReply" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ReplyToReply_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ReplyToReply_B_index" ON "_ReplyToReply"("B");

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "Replies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReplyToReply" ADD CONSTRAINT "_ReplyToReply_A_fkey" FOREIGN KEY ("A") REFERENCES "Replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReplyToReply" ADD CONSTRAINT "_ReplyToReply_B_fkey" FOREIGN KEY ("B") REFERENCES "Replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
