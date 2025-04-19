import { Request } from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { config } from './app.config'
import passport from 'passport'
import { NotFoundException } from '../utils/appError'

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      const { email, sub: googleId, picture } = profile._json
      console.log(profile, 'profile')
      console.log(googleId, 'googleId')
      if (!googleId) {
        throw new NotFoundException('Google ID (sub) is missing')
      }
      return done(null, profile)
    }
  )
)
