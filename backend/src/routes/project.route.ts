import { Router } from 'express'
import {
  createProjectController,
  deleteProjectByIdController,
  getAllProjectsInWorkspaceController,
  getProjectByIdAndWorkspaceIdController
} from '../controllers/project.controller'

const projectRoutes = Router()

projectRoutes.post('/workspace/:workspaceId/create', createProjectController)
projectRoutes.get('/workspace/:workspaceId/all', getAllProjectsInWorkspaceController)
projectRoutes.delete('/:id/workspace/:workspaceId/delete', deleteProjectByIdController)
projectRoutes.delete('/:id/workspace/:workspaceId', getProjectByIdAndWorkspaceIdController)

export default projectRoutes
