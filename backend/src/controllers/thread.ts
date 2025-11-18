import { Request, Response } from 'express'
import { prisma } from '../connection/client'

export async function getThreads(req: Request, res: Response) {
	const limit = Number(req.query.limit)

	try {
		const threadRecords = await prisma.threads.findMany({
			take: limit,
			include: {
				creator: {
					select: {
						id: true,
						username: true,
						photo_profile: true,
						full_name: true,
					},
				},
				_count: { select: { likes: true, replies: true } },
			},
		})
		const threads = await Promise.all(
			threadRecords.map(async (thread) => ({
				...thread,
				isLiked: await prisma.likes.findFirst({
					where: { thread_id: thread.id, user_id: (req as any).user.id },
				}) ? true : false,
			}))
		)
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Get Data Thread Successfully',
			threads,
		})
	} catch (error: any) {
		res.status(error.status || 500).json({
			code: error.status || 500,
			status: 'error',
			message: error.message,
		})
	}
}
