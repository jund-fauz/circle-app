import { Request, Response } from 'express'
import { compare, hash } from 'bcrypt'
import { prisma } from '../connection/client'
import { signToken } from '../utils/jwt'
import { errorFunc } from '../middlewares/errorHandler'
import { redis } from '../utils/redis'

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: User authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *   summary: Register a new user
 *   description: Create a new user account with username, email, and password
 *   tags: [Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - username
 *        - name
 *        - email
 *        - password
 *       properties:
 *        username:
 *         type: string
 *         description: Unique username
 *        name:
 *         type: string
 *         description: Full name of user
 *        email:
 *         type: string
 *         format: email
 *         description: User email address
 *        password:
 *         type: string
 *         format: password
 *         description: User password
 *   responses:
 *    '201':
 *     description: User registered successfully
 *    '400':
 *     description: Bad Request - User already exists
 */
export async function register(req: Request, res: Response, ctx?: any) {
	const { username, name, email, password } = req.body
	const prismaClient = ctx?.prisma || prisma
	let cryptedPassword = await hash(password, 10)
	try {
		await redis.del('threads')
		const userByEmail = await prismaClient.user.findUnique({ where: { email } })
		if (userByEmail)
			throw { status: 400, message: `User dengan email ${email} sudah ada` }
		const userByUsername = await prismaClient.user.findUnique({
			where: { username },
		})
		if (userByUsername)
			throw {
				status: 400,
				message: `User dengan username ${username} sudah ada`,
			}
		const user = await prismaClient.user.create({
			data: { username, full_name: name, email, password: cryptedPassword },
		})
		const token = signToken({ id: user.id, username })
		res.status(201).json({
			code: 201,
			status: 'success',
			message: 'Register berhasil. Akun berhasil dibuat',
			data: {
				user_id: user.id,
				username,
				name,
				email,
				token,
			},
		})
	} catch (error) {
		errorFunc(error, res)
	}
}

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *   summary: Login user
 *   description: Authenticate user with email or username and password
 *   tags: [Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - identifier
 *        - password
 *       properties:
 *        identifier:
 *         type: string
 *         description: User email or username
 *        password:
 *         type: string
 *         format: password
 *         description: User password
 *   responses:
 *    '200':
 *     description: Login successful
 *    '404':
 *     description: User not found
 *    '401':
 *     description: Invalid password
 */
export async function login(req: Request, res: Response) {
	const { identifier, password } = req.body
	try {
		await redis.del('threads')
		const user = await prisma.user.findFirst({
			where: { OR: [{ email: identifier }, { username: identifier }] },
		})
		if (!user) throw { status: 404, message: 'User not found' }
		const verify = await compare(password, user.password)
		if (!verify) throw { status: 401, message: 'Invalid login' }
		const token = signToken({ id: user.id, username: user.username })
		res.status(200).json({
			code: 200,
			status: 'success',
			message: 'Login successful',
			data: {
				user_id: user.id,
				username: user.username,
				name: user.full_name,
				email: identifier,
				avatar: user.photo_profile,
				token,
			},
		})
	} catch (error) {
		errorFunc(error, res)
	}
}
