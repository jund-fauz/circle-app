import { Router } from "express";
import { getThreads } from "../controllers/thread";
import { authenticate } from "../middlewares/auth";

export const threadRouter = Router()

threadRouter.get('/thread', authenticate, getThreads)