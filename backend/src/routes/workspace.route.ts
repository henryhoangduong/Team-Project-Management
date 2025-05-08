import { Router } from 'express'
import {
  changeMemberRoleController,
  createWorkspaceController,
  deleteWorkspaceByIdController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  getWorkspaceMemberController,
  updateWorkspaceByIdController
} from '../controllers/workspace.controller'

export const workspaceRoutes = Router()

workspaceRoutes.post('/create/new', createWorkspaceController)
workspaceRoutes.get('/all', getAllWorkspacesUserIsMemberController)
workspaceRoutes.get('/:id', getWorkspaceByIdController)
workspaceRoutes.put('/update/:id', updateWorkspaceByIdController)
workspaceRoutes.delete('/delete/:id', deleteWorkspaceByIdController)
workspaceRoutes.get('/analytics/:id', getWorkspaceAnalyticsController)
workspaceRoutes.get('/members/:id', getWorkspaceMemberController)
workspaceRoutes.put('/change/member/role/:id', changeMemberRoleController)
