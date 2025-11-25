import { Router } from 'express'
import { likeThread, deleteLikeThread } from '../controllers/like'
import { authenticate } from '../middlewares/auth'

export const likeRouter = Router()

likeRouter.post('/', authenticate, likeThread)
likeRouter.delete('/', authenticate, deleteLikeThread)
