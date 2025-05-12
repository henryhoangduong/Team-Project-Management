import { Router } from 'express'
import {
  createProjectController,
  deleteProjectByIdController,
  getAllProjectsInWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController
} from '../controllers/project.controller'

const projectRoutes = Router()

projectRoutes.post('/workspace/:workspaceId/create', createProjectController)
projectRoutes.get('/workspace/:workspaceId/all', getAllProjectsInWorkspaceController)
projectRoutes.delete('/:id/workspace/:workspaceId/delete', deleteProjectByIdController)
projectRoutes.get('/:id/workspace/:workspaceId', getProjectByIdAndWorkspaceIdController)
projectRoutes.get('/:id/workspace/:workspaceId/analytics', getProjectAnalyticsController)
export default projectRoutes
