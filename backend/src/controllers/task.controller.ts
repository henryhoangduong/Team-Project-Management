import { getMemberRoleInWorkspace } from './../services/member.service'
import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { projectIdSchema } from '../validation/project.validation'
import { workspaceIdSchema } from '../validation/auth.validation'
import { createTaskSchema, taskIdSchema, updateTaskSchema } from '../validation/task.validation'
import { roleGuard } from '../utils/roleGuard'
import { Permissions } from '../enums/role.enum'
import { createTaskService, getAllTasksService, updateTaskService } from '../services/task.service'

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

export const getAllTaskController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)

  const filters = {
    projectId: req.query.projectId as string | undefined,
    priority: req.query.priority ? (req.query.priority as string)?.split(',') : undefined,
    status: req.query.status ? (req.query.status as string)?.split(',') : undefined,
    assignedTo: req.query.assignedTo ? (req.query.assignedTo as string)?.split(',') : undefined,
    keyword: req.query.keyword as string | undefined,
    dueDate: req.query.dueDate as string | undefined
  }

  const pagination = {
    pageSize: parseInt(req.query.pageSize as string) || 10,
    pageNumber: parseInt(req.query.pageNumber as string) || 1
  }
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)

  roleGuard(role, [Permissions.VIEW_ONLY])
  const result = await getAllTasksService(workspaceId, filters, pagination)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Task upated',
    result
  })
})
