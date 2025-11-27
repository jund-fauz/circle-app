import { Router } from 'express'
import {
	followSomeone,
	getFollowers,
	getProfile,
	getProfiles,
	search,
	setProfile,
	unfollowSomeone,
} from '../controllers/profile'
import { authenticate } from '../middlewares/auth'
import { upload } from '../utils/multer'

export const profileRouter = Router()

profileRouter.get('/profile', authenticate, getProfile)
profileRouter.put('/profile', authenticate, upload.single('image'), setProfile)
profileRouter.get('/profiles', authenticate, getProfiles)
profileRouter.get('/follows', authenticate, getFollowers)
profileRouter.post('/follows', authenticate, followSomeone)
profileRouter.delete('/follows', authenticate, unfollowSomeone)
profileRouter.get('/search', authenticate, search)