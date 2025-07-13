import { Router } from 'express'
import { addTaskController, updateTaskController } from '../controllers/task.controller'

export const taskRoutes = Router()

taskRoutes.post('/project/:projectId/workspace/:workspaceId/create', addTaskController)
taskRoutes.put('/:id/project/:projectId/workspace/:workspaceId/update', updateTaskController)
