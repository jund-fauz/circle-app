import { Router } from "express";
import { createThread, getThreadDetail, getThreadReplies, getThreads } from "../controllers/thread";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

export const threadRouter = Router()

threadRouter.get('/thread', authenticate, getThreads)
threadRouter.post('/thread', authenticate, upload.single('image'), createThread)
threadRouter.get('/thread/:threadId', authenticate, getThreadDetail)
threadRouter.get('/reply/:threadId', authenticate, getThreadReplies)