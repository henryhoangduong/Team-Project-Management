import { getMemberRoleInWorkspace } from './../services/member.service'
import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { projectIdSchema } from '../validation/project.validation'
import { workspaceIdSchema } from '../validation/auth.validation'
import { createTaskSchema } from '../validation/task.validation'
import { roleGuard } from '../utils/roleGuard'
import { Permissions } from '../enums/role.enum'
import { createTaskService } from '../services/task.service'

export const addTaskController = asyncHandler(async (req: Request, res: Response) => {
  const projectId = projectIdSchema.parse(req.params.projectId)
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const userId = req.user?._id
  const data = createTaskSchema.parse(req.body)
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.CREATE_TASK])
  const { task } = await createTaskService(workspaceId, projectId, userId, data)
  roleGuard(userId, [Permissions.CREATE_TASK])
  return res.status(HTTPSTATUS.OK).json({
    message: 'Task created',
    task
  })
})
