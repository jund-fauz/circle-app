import { Request, Response } from 'express'
import { register } from '../src/controllers/auth'
import { Context, createMockContext, MockContext } from './context'
import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt'

jest.mock('bcrypt', () => ({
	hash: jest.fn((x) => x),
}))

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
	mockCtx = createMockContext()
	ctx = mockCtx as unknown as Context
})

const request = {
	body: {
		email: 'fake_email',
		name: 'fake_name',
		username: 'fake_username',
		password: 'fake_password',
	},
} as Request

const response = {
	status: jest.fn((x) => x).mockReturnThis(),
	json: jest.fn((x) => x).mockReturnThis(),
} as unknown as Response

it('should send a status code of 400 when user exists', async () => {
	mockCtx.prisma.user.findUnique({
		where: {
			id: 1,
			email: 'email',
			password: 'password',
		},
	})
	await register(request, response)
	expect(response.status).toHaveBeenCalledWith(400)
	expect(response.json).toHaveBeenCalledTimes(1)
})

it('should send a status code of 201 when new user is created', async () => {
	mockCtx.prisma.user.findUnique.mockResolvedValue(null)
	mockCtx.prisma.user.create.mockResolvedValue({
		id: 1,
		username: 'username',
		full_name: 'full_name',
		email: 'email',
		password: 'password',
		bio: '',
		photo_profile: '',
		created_at: new Date(),
		updated_at: new Date(),
	})
	await register(request, response, ctx)
	expect(hash).toHaveBeenCalledWith('fake_password', 10)
	expect(mockCtx.prisma.user.create).toHaveBeenCalledWith({
		data: {
			email: 'fake_email',
			full_name: 'fake_name',
			username: 'fake_username',
			password: 'fake_password',
		},
	})
})
