import { Router } from 'express'
import { addTaskController } from '../controllers/task.controller'

export const taskRoutes = Router()

taskRoutes.post('/project/:projectId/workspace/:workspaceId', addTaskController)
