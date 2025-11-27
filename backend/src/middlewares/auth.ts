import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'
import { errorFunc } from './errorHandler'

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) throw { status: 401, message: 'Unauthorized' }
	const user = verifyToken(token)
	if (!user) throw { status: 401, message: 'Unauthorized' }
	try {
		(req as any).user = user
		next()
	} catch (error) {
		errorFunc(error, res)
	}
}