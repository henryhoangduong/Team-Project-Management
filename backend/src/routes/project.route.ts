import { Router } from 'express'
import {
  createProjectController,
  deleteProjectByIdController,
  getAllProjectsInWorkspaceController
} from '../controllers/project.controller'

const projectRoutes = Router()

projectRoutes.post('/workspace/:workspaceId/create', createProjectController)
projectRoutes.get('/workspace/:workspaceId/all', getAllProjectsInWorkspaceController)
projectRoutes.delete('/:id/workspace/:workspaceId/delete', deleteProjectByIdController)
export default projectRoutes
