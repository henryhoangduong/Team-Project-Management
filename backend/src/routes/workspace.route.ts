import { Router } from 'express'
import {
  createWorkspaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceByIdController
} from '../controllers/workspace.controller'

export const workspaceRoutes = Router()

workspaceRoutes.post('/create/new', createWorkspaceController)
workspaceRoutes.get('/all', getAllWorkspacesUserIsMemberController)
workspaceRoutes.get('/:id', getWorkspaceByIdController)
