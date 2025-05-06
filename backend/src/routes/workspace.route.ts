import { Router } from 'express'
import {
  createWorkspaceController,
  deleteWorkspaceByIdController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  updateWorkspaceByIdController
} from '../controllers/workspace.controller'

export const workspaceRoutes = Router()

workspaceRoutes.post('/create/new', createWorkspaceController)
workspaceRoutes.get('/all', getAllWorkspacesUserIsMemberController)
workspaceRoutes.get('/:id', getWorkspaceByIdController)
workspaceRoutes.put('/update/:id', updateWorkspaceByIdController)
workspaceRoutes.delete('/delete/:id', deleteWorkspaceByIdController)
workspaceRoutes.get('/analytics/:id', getWorkspaceAnalyticsController)
