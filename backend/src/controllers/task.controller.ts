import { getMemberRoleInWorkspace } from './../services/member.service'
import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { projectIdSchema } from '../validation/project.validation'
import { workspaceIdSchema } from '../validation/auth.validation'
import { createTaskSchema, taskIdSchema, updateTaskSchema } from '../validation/task.validation'
import { roleGuard } from '../utils/roleGuard'
import { Permissions } from '../enums/role.enum'
import { createTaskService, updateTaskService } from '../services/task.service'

export const addTaskController = asyncHandler(async (req: Request, res: Response) => {
  const projectId = projectIdSchema.parse(req.params.projectId)
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const userId = req.user?._id
  const data = createTaskSchema.parse(req.body)
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.CREATE_TASK])
  const { task } = await createTaskService(workspaceId, projectId, userId, data)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Task created',
    task
  })
})

export const updateTaskController = asyncHandler(async (req: Request, res: Response) => {
  const projectId = projectIdSchema.parse(req.params.projectId)
  const taskId = taskIdSchema.parse(req.params.id)
  const body = updateTaskSchema.parse(req.body)
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const userId = req.user?._id

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)

  roleGuard(role, [Permissions.EDIT_TASK])
  const { updateTask } = await updateTaskService(workspaceId, projectId, taskId, body)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Task upated',
    updateTask
  })
})
