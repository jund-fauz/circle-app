import { Request, Response } from 'express'
import { prisma } from '../connection/client'
import { threadSchema } from '../validation/thread'
import { errorFunc } from '../middlewares/errorHandler'
import { redis } from '../utils/redis'

/**
 * @swagger
 * components:
 *   schemas:
 *     Thread:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: The thread ID
 *         content:
 *           type: string
 *           description: The thread's content
 *         image:
 *           type: string
 *           description: The thread's image
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             photo_profile:
 *               type: string
 *             full_name:
 *               type: string
 *         _count:
 *           type: object
 *           properties:
 *             likes:
 *               type: integer
 *             replies:
 *               type: integer
 *         isLiked:
 *           type: boolean
 *       example:
 *         id: 1
 *         content: "Halo!"
 *         image: "image.jpg"
 *         created_at: "2025-11-26T12:00:00Z"
 *         creator:
 *           id: 1
 *           username: "user1"
 *           photo_profile: "profile.jpg"
 *           full_name: "User One"
 *         _count:
 *           likes: 5
 *           replies: 2
 *         isLiked: true
 */

/**
 * @swagger
 * tags:
 *  name: Threads
 *  description: Threads management
 */

/**
 * @swagger
 * /api/v1/thread:
 *  get:
 *   summary: Get all Threads
 *   tags: [Threads]
 *   security:
 *    - BearerAuth: []
 *   parameters:
 *    - in: query
 *      name: limit
 *      schema:
 *       type: number
 *      description: Number of threads to retrieve
 *    - in: query
 *      name: byUser
 *      schema:
 *       type: boolean
 *      description: Filter threads by current user
 *   responses:
 *    '200':
 *     description: Get Data Thread Successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         code:
 *          type: number
 *         status:
 *          type: string
 *         message:
 *          type: string
 *         threads:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Thread'
 *    '400':
 *     description: Bad Request
 *    '401':
 *     description: Unauthorized - Missing or invalid Bearer token
 */

export async function getThreads(req: Request, res: Response) {
	const limit = Number(req.query.limit)
	const byUser = Boolean(req.query.byUser)

	try {
		if (!byUser) {
			const json = await redis.get('threads')
			if (json) {
				const threadsCached = JSON.parse(json)
				return res.status(200).json({
					code: 200,
					status: 'success',
					message: 'Get Data Thread Successfully',
					threads: threadsCached,
				})
			}
		}
		const threadRecords = byUser
			? await prisma.threads.findMany({
					take: limit,
					select: {
						id: true,
						content: true,
						image: true,
						created_at: true,
						creator: {
							select: {
								id: true,
								username: true,
								photo_profile: true,
								full_name: true,
							},
						},
						_count: {
							select: {
								likes: true,
								replies: true,
							},
						},
					},
					where: { created_by: (req as any).user.id },
					orderBy: { id: 'desc' },
			  })
			: await prisma.threads.findMany({
					take: limit,
					select: {
						id: true,
						content: true,
						image: true,
						created_at: true,
						creator: {
							select: {
								id: true,
								username: true,
								photo_profile: true,
								full_name: true,
							},
						},
						_count: {
							select: {
								likes: true,
								replies: true,
							},
						},
					},
					orderBy: { id: 'desc' },
			  })
		const threads = await Promise.all(
			threadRecords.map(async (thread) => ({
				...thread,
				isLiked: (await prisma.likes.findFirst({
					where: { thread_id: thread.id, user_id: (req as any).user.id },
				}))
					? true
					: false,
			}))
		)
		if (!byUser) await redis.setex('threads', 60 * 60, JSON.stringify(threads))
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Get Data Thread Successfully',
			threads,
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/thread:
 *  post:
 *   summary: Create a new Thread
 *   description: Create a new thread with content and optional image. Clears cache after posting.
 *   tags: [Threads]
 *   security:
 *    - BearerAuth: []
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
 *         description: The thread content
 *        image:
 *         type: string
 *         format: binary
 *         description: Optional image file
 *   responses:
 *    201:
 *     description: Thread created successfully
 *    400:
 *     description: Bad Request - Invalid content
 *    401:
 *     description: Unauthorized
 */
export async function createThread(req: Request, res: Response) {
	try {
		await redis.del('threads')
		const { error } = threadSchema.validate(req.body)
		if (error) throw { status: 400, message: error.message }
		const { content } = req.body
		if (!content) throw { status: 400, message: 'Content is required' }
		const image = req.file
		const thread = await prisma.threads.create({
			data: {
				content,
				image: image?.filename,
				created_by: (req as any).user.id,
				updated_by: (req as any).user.id,
			},
		})
		res.status(201).json({
			code: 201,
			status: 'success',
			message: 'Thread berhasil diposting.',
			data: {
				tweet: {
					id: thread.id,
					user_id: thread.created_by,
					content: thread.content,
					image_url: thread.image,
					timestamp: thread.created_at,
				},
			},
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/thread/{threadId}:
 *  get:
 *   summary: Get Thread Detail
 *   description: Retrieve detailed information about a specific thread
 *   tags: [Threads]
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
 *    200:
 *     description: Thread detail retrieved successfully
 *    400:
 *     description: Bad Request - Missing thread ID
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Thread not found
 */
export async function getThreadDetail(req: Request, res: Response) {
	const { threadId } = req.params
	if (!threadId) throw { status: 400, message: 'Thread ID is required' }
	try {
		const thread = await prisma.threads.findUnique({
			where: { id: Number(threadId) },
			select: {
				id: true,
				content: true,
				image: true,
				created_at: true,
				creator: {
					select: {
						id: true,
						username: true,
						photo_profile: true,
						full_name: true,
					},
				},
				_count: {
					select: {
						likes: true,
						replies: true,
					},
				},
			},
		})
		if (!thread) throw { status: 404, message: 'Thread not found' }
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Get Data Thread Successfully',
			data: {
				...thread,
				isLiked: (await prisma.likes.findFirst({
					where: { thread_id: thread.id, user_id: (req as any).user.id },
				}))
					? true
					: false,
			},
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/thread/pictures:
 *  get:
 *   summary: Get User Thread Pictures
 *   description: Retrieve all threads with images created by the current user
 *   tags: [Threads]
 *   security:
 *    - BearerAuth: []
 *   responses:
 *    200:
 *     description: Thread images retrieved successfully
 *    401:
 *     description: Unauthorized
 */
export async function getThreadPictures(req: Request, res: Response) {
	try {
		const pictures = await prisma.threads.findMany({
			where: { created_by: (req as any).user.id, image: { not: '' } },
			select: { id: true, image: true },
			orderBy: { id: 'desc' },
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Get Thread Images Successfully',
			data: pictures,
		})
	} catch (error) {
		errorFunc(error, res)
	}
}
