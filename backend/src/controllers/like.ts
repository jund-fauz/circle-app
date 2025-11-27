import { Request, Response } from 'express'
import { prisma } from '../connection/client'
import { errorFunc } from '../middlewares/errorHandler'

/**
 * @swagger
 * tags:
 *  name: Likes
 *  description: Thread and reply like management
 */

/**
 * @swagger
 * /api/v1/like:
 *  post:
 *   summary: Like a thread
 *   description: Add a like to a thread
 *   tags: [Likes]
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - tweet_id
 *       properties:
 *        tweet_id:
 *         type: integer
 *         description: Thread ID to like
 *   responses:
 *    '200':
 *     description: Thread liked successfully
 *    '400':
 *     description: Bad Request - Missing thread ID
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: Thread not found
 */
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

/**
 * @swagger
 * /api/v1/like:
 *  delete:
 *   summary: Unlike a thread
 *   description: Remove a like from a thread
 *   tags: [Likes]
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - tweet_id
 *       properties:
 *        tweet_id:
 *         type: integer
 *         description: Thread ID to unlike
 *   responses:
 *    '200':
 *     description: Thread like deleted successfully
 *    '400':
 *     description: Bad Request - Missing thread ID
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: Thread not found
 */
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
