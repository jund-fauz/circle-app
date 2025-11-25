import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../connection/client'
import { signToken } from '../utils/jwt'
import { errorFunc } from '../middlewares/errorHandler'

export async function register(req: Request, res: Response) {
	const { username, name, email, password } = req.body
	let cryptedPassword = await bcrypt.hash(password, 10)
	try {
		const userByEmail = await prisma.user.findUnique({ where: { email } })
		if (userByEmail)
			throw { status: 409, message: `User dengan email ${email} sudah ada` }
		const userByUsername = await prisma.user.findUnique({ where: { username } })
		if (userByUsername)
			throw {
				status: 409,
				message: `User dengan username ${username} sudah ada`,
			}
		const user = await prisma.user.create({
			data: { username, full_name: name, email, password: cryptedPassword },
		})
		const token = signToken({ id: user.id, username })
		res.status(200).json({
			code: 200,
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

export async function login(req: Request, res: Response) {
	const { identifier, password } = req.body
	try {
		const user = await prisma.user.findFirst({
			where: { OR: [{ email: identifier }, { username: identifier }] },
		})
		if (!user) throw { status: 404, message: 'User not found' }
		const verify = await bcrypt.compare(password, user.password)
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
