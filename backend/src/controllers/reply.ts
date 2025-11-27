import { Request, Response } from 'express'
import { prisma } from '../connection/client'
import { threadSchema } from '../validation/thread'
import { errorFunc } from '../middlewares/errorHandler'
import { redis } from '../utils/redis'

/**
 * @swagger
 * tags:
 *  name: Replies
 *  description: Thread reply management
 */

/**
 * @swagger
 * /api/v1/reply/{threadId}:
 *  get:
 *   summary: Get thread replies
 *   description: Retrieve all replies for a specific thread
 *   tags: [Replies]
 *   security:
 *    - BearerAuth: []
 *   parameters:
 *    - in: path
 *      name: threadId
 *      required: true
 *      schema:
 *       type: integer
 *      description: The thread ID
 *   responses:
 *    '200':
 *     description: Thread replies retrieved successfully
 *    '400':
 *     description: Bad Request - Missing thread ID
 *    '401':
 *     description: Unauthorized
 */
export async function getThreadReplies(req: Request, res: Response) {
	const { threadId } = req.params
	if (!threadId) throw { status: 400, message: 'Thread ID is required' }
	try {
		const replyRecords = await prisma.replies.findMany({
			where: { thread_id: Number(threadId) },
			orderBy: { id: 'desc' },
			select: {
				id: true,
				content: true,
				creator: {
					select: {
						id: true,
						username: true,
						full_name: true,
						photo_profile: true,
					},
				},
				image: true,
				created_at: true,
				_count: {
					select: {
						likes: true,
					},
				},
			},
		})
		const replies = await Promise.all(
			replyRecords.map(async (reply) => ({
				...reply,
				isLiked: (await prisma.likes.findFirst({
					where: { reply_id: reply.id, user_id: (req as any).user.id },
				}))
					? true
					: false,
			}))
		)
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Get Data Thread Successfully',
			data: { replies },
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/reply/{threadId}:
 *  post:
 *   summary: Post a reply to a thread
 *   description: Create a reply with content and optional image to a specific thread
 *   tags: [Replies]
 *   security:
 *    - BearerAuth: []
 *   parameters:
 *    - in: path
 *      name: threadId
 *      required: true
 *      schema:
 *       type: integer
 *      description: The thread ID
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       required:
 *        - content
 *       properties:
 *        content:
 *         type: string
 *         description: Reply content
 *        image:
 *         type: string
 *         format: binary
 *         description: Optional image file
 *   responses:
 *    '201':
 *     description: Reply created successfully
 *    '400':
 *     description: Bad Request - Invalid content or missing thread ID
 *    '401':
 *     description: Unauthorized
 */
export async function postReply(req: Request, res: Response) {
	const { threadId } = req.params
	if (!threadId) throw { status: 400, message: 'Thread ID is required' }
	try {
		await redis.del('threads')
		const { error } = threadSchema.validate(req.body)
		if (error) throw { status: 400, message: error.message }
		const { content } = req.body
		if (!content) throw { status: 400, message: 'Content is required' }
		const userId = (req as any).user.id
		const image = req.file
		const reply = await prisma.replies.create({
			data: {
				content,
				thread_id: Number(threadId),
				user_id: userId,
				image: image?.filename,
				updated_by: userId,
			},
		})
		res.status(201).json({
			code: 201,
			status: 'success',
			message: 'Reply created successfully',
			data: {
				tweet: {
					id: reply.id,
					user_id: reply.user_id,
					content: reply.content,
					image_url: reply.image,
					timestamp: reply.created_at,
				},
			},
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/reply/like:
 *  post:
 *   summary: Like a reply
 *   description: Add a like to a reply
 *   tags: [Replies]
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - reply_id
 *       properties:
 *        reply_id:
 *         type: integer
 *         description: Reply ID to like
 *   responses:
 *    '200':
 *     description: Reply liked successfully
 *    '400':
 *     description: Bad Request - Missing reply ID
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: Reply not found
 */
export async function likeReply(req: Request, res: Response) {
	const { reply_id } = req.body
	if (!reply_id) throw { status: 400, message: 'Reply ID is required' }
	try {
		const reply = await prisma.replies.findUnique({
			where: { id: Number(reply_id) },
		})
		if (!reply) throw { status: 404, message: 'Reply not found' }
		const like = await prisma.likes.create({
			data: {
				reply_id: Number(reply_id),
				user_id: (req as any).user.id,
			},
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Reply liked successfully',
			reply_id: like.reply_id,
			user_id: like.user_id,
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/reply/like:
 *  delete:
 *   summary: Unlike a reply
 *   description: Remove a like from a reply
 *   tags: [Replies]
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - reply_id
 *       properties:
 *        reply_id:
 *         type: integer
 *         description: Reply ID to unlike
 *   responses:
 *    '200':
 *     description: Reply like deleted successfully
 *    '400':
 *     description: Bad Request - Missing reply ID
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: Reply not found
 */
export async function deleteLikeReply(req: Request, res: Response) {
	const { reply_id } = req.body
	if (!reply_id) throw { status: 400, message: 'Reply ID is required' }
	try {
		const reply = await prisma.replies.findUnique({
			where: { id: Number(reply_id) },
		})
		if (!reply) throw { status: 404, message: 'Reply not found' }
		await prisma.likes.deleteMany({
			where: {
				reply_id: Number(reply_id),
				user_id: (req as any).user.id,
			},
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Reply like deleted successfully',
		})
	} catch (error) {
		errorFunc(error, res)
	}
}
