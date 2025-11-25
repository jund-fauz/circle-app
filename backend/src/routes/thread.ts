import { Router } from "express";
import { createThread, getThreadDetail, getThreadPictures, getThreads } from "../controllers/thread";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

export const threadRouter = Router()

threadRouter.get('/', authenticate, getThreads)
threadRouter.post('/', authenticate, upload.single('image'), createThread)
threadRouter.get('/pictures', authenticate, getThreadPictures)
threadRouter.get('/:threadId', authenticate, getThreadDetail)