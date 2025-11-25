import { Router } from 'express'
import { getProfile, getProfiles, setProfile } from '../controllers/profile'
import { authenticate } from '../middlewares/auth'
import { upload } from '../utils/multer'

export const profileRouter = Router()

profileRouter.get('/profile', authenticate, getProfile)
profileRouter.put('/profile', authenticate, upload.single('image'), setProfile)
profileRouter.get('/profiles', authenticate, getProfiles)