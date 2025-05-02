import { Router } from 'express'
import passport from 'passport'
import { config } from '../config/app.config'
import {
  googleLoginCallback,
  loginController,
  logOutController,
  registerUserController
} from '../controllers/auth.controller'

const failedURl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
const authRoutes = Router()

authRoutes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)
authRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: failedURl
  }),
  googleLoginCallback
)

authRoutes.post('/register', registerUserController)
authRoutes.post('/login', loginController)
authRoutes.get('/logout', logOutController)

export default authRoutes
