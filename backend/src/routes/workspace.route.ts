import { Router } from 'express'
import {
  createWorkspaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceByIdController,
  updateWorkspaceByIdController
} from '../controllers/workspace.controller'

export const workspaceRoutes = Router()

workspaceRoutes.post('/create/new', createWorkspaceController)
workspaceRoutes.get('/all', getAllWorkspacesUserIsMemberController)
workspaceRoutes.get('/:id', getWorkspaceByIdController)
workspaceRoutes.put('/update/:id', updateWorkspaceByIdController)
