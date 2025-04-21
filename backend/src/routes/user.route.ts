import { Router } from 'express'
import { getCurrentUserController } from '../controllers/user.controller'

const userRoutes = Router()

userRoutes.use('/current', getCurrentUserController)

export default userRoutes
