import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'
import { authRouter } from './routes/auth'
import { json } from 'body-parser'
import { threadRouter } from './routes/thread'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import { UserPayload, verifyToken } from './utils/jwt'
import { prisma } from './connection/client'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
})

dotenv.config()
app.use(json())
app.use(cors({ origin: 'http://localhost:5173' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1', threadRouter)
app.use(errorHandler)

io.on('connection', (socket) => {
	socket.on('send_message', async (data) => {
		const verify = verifyToken(data.token)
		const user = await prisma.user.findUnique({
			where: { id: (verify as UserPayload).id },
		})
		io.emit(
			'receive_message',
			{
				content: data.content,
				image: data.image ? Buffer.from(data.image).toString('base64') : null,
				creator: {
					username: user?.username,
					full_name: user?.full_name,
					photo_profile: user?.photo_profile,
				},
			},
			data.token
		)
	})
})

server.listen(3000, () => {
	console.log('Server is running on port http://localhost:3000')
})
