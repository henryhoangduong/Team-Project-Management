import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { getCurrentUserSerivce } from '../services/user.service'

export const getCurrentUserController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id
  const { user } = await getCurrentUserSerivce(userId)
  return res.status(HTTPSTATUS.OK).json({
    message: 'User fetch successfully',
    user
  })
})
