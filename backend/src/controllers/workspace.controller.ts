import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.middleware'
import { createWorkspaceSchema, updateWorkspaceSchema } from '../validation/workspace.validation'
import {
  createWorkspaceService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceByIdService,
  updateWorkspaceByIdService
} from '../services/workspace.service'
import { HTTPSTATUS } from '../config/http.config'
import { getMemberRoleInWorkspace } from '../services/member.service'
import { workspaceIdSchema } from '../validation/auth.validation'
import { roleGuard } from '../utils/roleGuard'
import { Permissions } from '../enums/role.enum'

export const createWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
  const body = createWorkspaceSchema.parse(req.body)
  const userId = req.user?._id
  const { workspace } = await createWorkspaceService(userId, body)
  return res.status(HTTPSTATUS.CREATED).json({
    message: 'Workspace created successfully',
    workspace
  })
})

export const getAllWorkspacesUserIsMemberController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id

  const { workspaces } = await getAllWorkspacesUserIsMemberService(userId)
  return res.status(HTTPSTATUS.OK).json({
    message: 'User workspaces fetched successfully',
    workspaces
  })
})

export const updateWorkspaceByIdController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id)
  const { name, description } = updateWorkspaceSchema.parse(req.body)
  const userId = req.user?._id
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGuard(role, [Permissions.EDIT_WORKSPACE])
  const { workspace } = await updateWorkspaceByIdService(workspaceId, name, description)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Workspace updated successfully',
    workspace
  })
})

export const getWorkspaceByIdController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id)
  const userId = req.user?._id

  await getMemberRoleInWorkspace(userId, workspaceId)

  const { workspace } = await getWorkspaceByIdService(workspaceId)

  return res.status(HTTPSTATUS.OK).json({
    message: 'Workspace fetched successfully',
    workspace
  })
})
