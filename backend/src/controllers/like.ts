import { Request, Response } from 'express'
import { prisma } from '../connection/client'
import { errorFunc } from '../middlewares/errorHandler'

export async function likeThread(req: Request, res: Response) {
	const { tweet_id } = req.body
	if (!tweet_id) throw { status: 400, message: 'Thread ID is required' }
	try {
		const thread = await prisma.threads.findUnique({
			where: { id: Number(tweet_id) },
		})
		if (!thread) throw { status: 404, message: 'Thread not found' }
		const like = await prisma.likes.create({
			data: {
				thread_id: Number(tweet_id),
				user_id: (req as any).user.id,
			},
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Tweet liked successfully',
			tweet_id: like.thread_id,
			user_id: like.user_id,
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

export async function deleteLikeThread(req: Request, res: Response) {
	const { tweet_id } = req.body
	if (!tweet_id) throw { status: 400, message: 'Thread ID is required' }
	try {
		const thread = await prisma.threads.findUnique({
			where: { id: Number(tweet_id) },
		})
		if (!thread) throw { status: 404, message: 'Thread not found' }
		await prisma.likes.deleteMany({
			where: {
				thread_id: Number(tweet_id),
				user_id: (req as any).user.id,
			},
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Tweet like deleted successfully',
		})
	} catch (error) {
		errorFunc(error, res)
	}
}
