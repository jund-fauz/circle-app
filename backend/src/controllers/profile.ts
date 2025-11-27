import { Request, Response } from 'express'
import { prisma } from '../connection/client'
import { errorFunc } from '../middlewares/errorHandler'

/**
 * @swagger
 * tags:
 *  name: Profiles
 *  description: User profile and follow management
 */

/**
 * @swagger
 * /api/v1/profile:
 *  get:
 *   summary: Get current user profile
 *   description: Retrieve profile information of the authenticated user
 *   tags: [Profiles]
 *   security:
 *    - BearerAuth: []
 *   responses:
 *    '200':
 *     description: Profile fetched successfully
 *    '401':
 *     description: Unauthorized
 */
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
				followings: { select: { follower_id: true } },
			},
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Profile fetched successfully',
			data: user,
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/profile:
 *  put:
 *   summary: Update user profile
 *   description: Update profile information including username, name, bio, and avatar
 *   tags: [Profiles]
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        username:
 *         type: string
 *        full_name:
 *         type: string
 *        bio:
 *         type: string
 *        image:
 *         type: string
 *         format: binary
 *   responses:
 *    '200':
 *     description: Profile updated successfully
 *    '401':
 *     description: Unauthorized
 */
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
				photo_profile: image && image.filename,
			},
			select: {
				username: true,
				full_name: true,
				bio: true,
				photo_profile: true,
			},
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Profile updated successfully',
			data: user,
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/profiles:
 *  get:
 *   summary: Get all user profiles
 *   description: Retrieve profiles of all users except the current user
 *   tags: [Profiles]
 *   security:
 *    - BearerAuth: []
 *   responses:
 *    '200':
 *     description: Profiles fetched successfully
 *    '401':
 *     description: Unauthorized
 */
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
			take: 3,
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Profiles fetched successfully',
			data: users,
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/follows:
 *  get:
 *   summary: Get followers or followings
 *   description: Retrieve list of followers or users being followed
 *   tags: [Profiles]
 *   security:
 *    - BearerAuth: []
 *   parameters:
 *    - in: query
 *      name: type
 *      schema:
 *       type: string
 *       enum: [followers, followings]
 *      description: Type of list to retrieve
 *   responses:
 *    '200':
 *     description: Followers or followings fetched successfully
 *    '401':
 *     description: Unauthorized
 */
export async function getFollowers(req: Request, res: Response) {
	const type = req.query.type as string
	try {
		const followersRecord =
			type === 'followers'
				? await prisma.user.findMany({
						where: {
							followings: {
								some: {
									follower_id: (req as any).user.id,
								},
							},
						},
						select: {
							id: true,
							username: true,
							full_name: true,
							bio: true,
							photo_profile: true,
						},
				  })
				: await prisma.user.findMany({
						where: {
							followers: {
								some: {
									following_id: (req as any).user.id,
								},
							},
						},
						select: {
							id: true,
							username: true,
							full_name: true,
							bio: true,
							photo_profile: true,
						},
				  })
		let followers: any
		if (type === 'followers')
			followers = await Promise.all(
				followersRecord.map(async (follower) => ({
					...follower,
					is_following: (await prisma.following.findFirst({
						where: {
							following_id: (req as any).user.id,
							follower_id: follower.id,
						},
					}))
						? true
						: false,
				}))
			)
		res.status(200).json({
			code: 200,
			status: 'success',
			message: `${
				type.charAt(0).toUpperCase() + type.slice(1)
			} fetched successfully`,
			data: type === 'followers' ? followers : followersRecord,
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/follows:
 *  post:
 *   summary: Follow a user
 *   description: Follow another user
 *   tags: [Profiles]
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - followed_user_id
 *       properties:
 *        followed_user_id:
 *         type: integer
 *         description: ID of user to follow
 *   responses:
 *    '201':
 *     description: User followed successfully
 *    '200':
 *     description: User already followed
 *    '400':
 *     description: Bad Request - Cannot follow yourself
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 */
export async function followSomeone(req: Request, res: Response) {
	const { followed_user_id } = req.body
	try {
		if (followed_user_id === (req as any).user.id)
			throw { status: 400, message: 'You cannot follow yourself' }
		const followed_user = await prisma.user.findUnique({
			where: { id: followed_user_id },
		})
		if (!followed_user) throw { status: 404, message: 'User not found' }
		const contain = await prisma.following.findFirst({
			where: {
				following_id: (req as any).user.id,
				follower_id: followed_user_id,
			},
		})
		if (!contain)
			await prisma.following.create({
				data: {
					following_id: (req as any).user.id,
					follower_id: followed_user_id,
				},
			})
		res.status(contain ? 200 : 201).json({
			code: contain ? 200 : 201,
			status: 'success',
			message:
				contain !== null
					? 'User already followed'
					: 'You have successfully followed the user',
			data: {
				user_id: followed_user_id,
				is_following: true,
			},
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/follows:
 *  delete:
 *   summary: Unfollow a user
 *   description: Unfollow another user
 *   tags: [Profiles]
 *   security:
 *    - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - followed_user_id
 *       properties:
 *        followed_user_id:
 *         type: integer
 *         description: ID of user to unfollow
 *   responses:
 *    '200':
 *     description: User unfollowed successfully
 *    '400':
 *     description: Bad Request - Cannot unfollow yourself
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 */
export async function unfollowSomeone(req: Request, res: Response) {
	const { followed_user_id } = req.body
	try {
		if (followed_user_id === (req as any).user.id)
			throw { status: 400, message: 'You cannot unfollow yourself' }
		const followed_user = await prisma.user.findUnique({
			where: { id: followed_user_id },
		})
		if (!followed_user) throw { status: 404, message: 'User not found' }
		const contain = await prisma.following.findFirst({
			where: {
				following_id: (req as any).user.id,
				follower_id: followed_user_id,
			},
		})
		if (contain)
			await prisma.following.deleteMany({
				where: {
					following_id: (req as any).user.id,
					follower_id: followed_user_id,
				},
			})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: !contain
				? 'User already unfollowed'
				: 'You have successfully unfollowed the user',
			data: {
				user_id: followed_user_id,
				is_following: false,
			},
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/search:
 *  get:
 *   summary: Search users
 *   description: Search for users by username or full name
 *   tags: [Profiles]
 *   security:
 *    - BearerAuth: []
 *   parameters:
 *    - in: query
 *      name: keyword
 *      required: true
 *      schema:
 *       type: string
 *      description: Search keyword
 *   responses:
 *    '200':
 *     description: Users searched successfully
 *    '400':
 *     description: Bad Request - Missing keyword
 *    '401':
 *     description: Unauthorized
 */
export async function search(req: Request, res: Response) {
	const keyword = req.query.keyword as string
	if (!keyword) throw { status: 400, message: 'keyword is required' }
	try {
		const users = await prisma.user.findMany({
			where: {
				OR: [
					{
						username: {
							search: keyword,
						},
					},
					{
						full_name: {
							search: keyword,
						},
					},
					{
						username: {
							contains: keyword,
						},
					},
					{
						full_name: {
							contains: keyword,
						},
					},
				],
			},
			select: {
				id: true,
				username: true,
				full_name: true,
				bio: true,
				photo_profile: true,
			}
		})
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'User searched successfully',
			data: { users },
		})
	} catch (error) {
		errorFunc(error, res)
	}
}
