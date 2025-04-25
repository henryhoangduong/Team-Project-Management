import { Router } from 'express'
import { createWorkspaceController } from '../controllers/workspace.controller'

export const workspaceRoutes = Router()

workspaceRoutes.post('/create/new', createWorkspaceController)
