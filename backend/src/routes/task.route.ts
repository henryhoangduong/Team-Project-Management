import { Router } from 'express'
import { addTaskController, getAllTaskController, updateTaskController } from '../controllers/task.controller'

export const taskRoutes = Router()

taskRoutes.post('/project/:projectId/workspace/:workspaceId/create', addTaskController)
taskRoutes.put('/:id/project/:projectId/workspace/:workspaceId/update', updateTaskController)
taskRoutes.get('/workspace/:workspaceId/all', getAllTaskController)
