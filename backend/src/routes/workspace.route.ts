import { Router } from 'express'
import { createWorkspaceController, getAllWorkspacesUserIsMemberController } from '../controllers/workspace.controller'

export const workspaceRoutes = Router()

workspaceRoutes.post('/create/new', createWorkspaceController)
workspaceRoutes.get('/all', getAllWorkspacesUserIsMemberController)
