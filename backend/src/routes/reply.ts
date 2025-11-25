import { Router } from 'express'
import { deleteLikeReply, getThreadReplies, likeReply, postReply } from '../controllers/reply'
import { authenticate } from '../middlewares/auth'
import { upload } from '../utils/multer'

export const replyRouter = Router()

replyRouter.get('/:threadId', authenticate, getThreadReplies)
replyRouter.post('/like', authenticate, likeReply)
replyRouter.post('/:threadId', authenticate, upload.single('image'), postReply)
replyRouter.delete('/like', authenticate, deleteLikeReply)