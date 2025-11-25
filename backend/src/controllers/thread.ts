import { Request, Response } from 'express'
import { prisma } from '../connection/client'
import { threadSchema } from '../validation/thread'
import { errorFunc } from '../middlewares/errorHandler'

export async function getThreads(req: Request, res: Response) {
	const limit = Number(req.query.limit)
	const byUser = Boolean(req.query.byUser)

	try {
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

export async function createThread(req: Request, res: Response) {
	try {
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
