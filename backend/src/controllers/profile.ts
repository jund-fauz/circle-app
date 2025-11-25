import { Request, Response } from 'express'
import { prisma } from '../connection/client'

export async function getProfile(req: Request, res: Response) {
	try {
		const userId = (req as any).user.id
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				full_name: true,
				photo_profile: true,
				bio: true,
				_count: {
					select: {
						followers: true,
						followings: true,
					},
				},
				followings: { select: { id: true, follower_id: true } },
			},
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Profile fetched successfully',
			data: user,
		})
	} catch (error: any) {
		res.status(error.status || 500).json({
			code: error.status || 500,
			status: 'error',
			message: error.message,
		})
	}
}

export async function setProfile(req: Request, res: Response) {
	const { username, full_name, bio } = req.body
	const image = req.file
	try {
		const user = await prisma.user.update({
			where: { id: (req as any).user.id },
			data: {
				username: username && username,
				full_name: full_name && full_name,
				bio: bio && bio,
				photo_profile: image && image.filename
			},
			select: {
				username: true,
				full_name: true,
				bio: true,
				photo_profile: true
			}
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Profile updated successfully',
			data: user,
		})
	} catch (error: any) {
		res.status(error.status || 500).json({
			code: error.status || 500,
			status: 'error',
			message: error.message,
		})
	}
}

export async function getProfiles(req: Request, res: Response) {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				full_name: true,
				photo_profile: true,
			},
			where: { id: { not: (req as any).user.id } },
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Profiles fetched successfully',
			data: users,
		})
	} catch (error: any) {
		res.status(error.status || 500).json({
			code: error.status || 500,
			status: 'error',
			message: error.message,
		})
	}
}
