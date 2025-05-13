import { projectIdSchema, updateProjectSchema } from './../validation/project.validation'
import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.middleware'
import { workspaceIdSchema } from '../validation/auth.validation'
import { HTTPSTATUS } from '../config/http.config'
import {
  createProjectService,
  deleteProjectByIdService,
  getAllProjectsInWorkspaceService,
  getProjectAnalyticsService,
  getProjectByIdAndWorkspaceIdService,
  updateProjectService
} from '../services/project.service'
import { createProjectSchema } from '../validation/project.validation'
import { getMemberRoleInWorkspace } from '../services/member.service'
import { roleGuard } from '../utils/roleGuard'
import { Permissions } from '../enums/role.enum'

export const createProjectController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const body = createProjectSchema.parse(req.body)
  const userId = req.user?._id
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.CREATE_PROJECT])

  const { project } = await createProjectService(workspaceId, userId, body)
  return res.status(HTTPSTATUS.CREATED).json({
    message: 'Project created',
    project
  })
})

export const getAllProjectsInWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const userId = req.user?._id

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.VIEW_ONLY])
  const pageSize = parseInt(req.query.pageSize as string) || 10
  const pageNumber = parseInt(req.query.pageNumber as string) || 1
  const { projects, totalCount, totalPages, skip } = await getAllProjectsInWorkspaceService(
    workspaceId,
    pageSize,
    pageNumber
  )
  return res.status(HTTPSTATUS.OK).json({
    message: 'Project fetched',
    projects,
    pagination: {
      totalCount,
      pageSize,
      pageNumber,
      totalPages,
      skip,
      limit: pageSize
    }
  })
})

export const deleteProjectByIdController = asyncHandler(async (req: Request, res: Response) => {
  const projectId = projectIdSchema.parse(req.params.id)
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const userId = req.user?._id
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.DELETE_PROJECT])
  await deleteProjectByIdService(workspaceId, projectId)

  return res.status(HTTPSTATUS.OK).json({
    message: 'Project deleted successfully'
  })
})

export const getProjectByIdAndWorkspaceIdController = asyncHandler(async (req: Request, res: Response) => {
  const projectId = projectIdSchema.parse(req.params.id)
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const userId = req.user?._id
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.VIEW_ONLY])
  const { project } = await getProjectByIdAndWorkspaceIdService(workspaceId, projectId)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Project fetched successfully',
    project
  })
})

export const getProjectAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
  const projectId = projectIdSchema.parse(req.params.id)
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const userId = req.user?._id
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.VIEW_ONLY])
  const { analytics } = await getProjectAnalyticsService(workspaceId, projectId)

  return res.status(HTTPSTATUS.OK).json({
    message: 'Project analytics retrieved successfully',
    analytics
  })
})

export const updateProjectController = asyncHandler(async (req: Request, res: Response) => {
  const projectId = projectIdSchema.parse(req.params.id)
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const data = updateProjectSchema.parse(req.body)
  const userId = req.user?._id
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.EDIT_PROJECT])
  const { project } = await updateProjectService(workspaceId, projectId, data)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Project updated',
    project
  })
})
