import { Request } from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { config } from './app.config'
import passport from 'passport'
import { NotFoundException } from '../utils/appError'
import { loginOrCreateAccountService, verifyUserService } from '../services/auth.service'
import { ProviderEnum } from '../enums/account-provider.enum'
import { Strategy as LocalStrategy } from 'passport-local'
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
      try {
        const { email, sub: googleId, picture } = profile._json
        if (!googleId) {
          throw new NotFoundException('Google ID (sub) is missing')
        }
        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGlE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email
        })
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: true
    },
    async (email: string, password: string, done) => {
      try {
        const user = await verifyUserService({ email, password })
        return done(null, user)
      } catch (error: any) {
        return done(error, false, { message: error?.message })
      }
    }
  )
)

passport.serializeUser((user: any, done) => done(null, user))
passport.deserializeUser((user: any, done) => done(null, user))
