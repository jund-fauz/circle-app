import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'
import { authRouter } from './routes/auth'
import { json } from 'body-parser'
import { threadRouter } from './routes/thread'

const app = express()
dotenv.config()
app.use(json())
app.use(cors({origin: 'http://localhost:5173'}))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1', threadRouter)
app.use(errorHandler)

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000')
})