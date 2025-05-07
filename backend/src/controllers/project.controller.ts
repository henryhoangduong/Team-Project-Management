import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.middleware'
import { workspaceIdSchema } from '../validation/auth.validation'
import { HTTPSTATUS } from '../config/http.config'
import { createProjectService } from '../services/project.service'
import { createProjectSchema } from '../validation/project.validation'

export const createProjectController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const body = createProjectSchema.parse(req.body)
  const userId = req.user?._id
  const { project } = await createProjectService(workspaceId, userId, body)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Project created',
    project
  })
})
