import ProjectModel from '../models/project.model'
import WorkSpaceModel from '../models/workspace.model'
import { NotFoundException } from '../utils/appError'

export const createProjectService = async (
  workspaceId: string,
  userId: string,
  body: {
    emoji?: string
    name: string
    description?: string
  }
) => {
  const workspace = await WorkSpaceModel.findById(workspaceId)
  if (!workspace) {
    throw new NotFoundException('Workspace not found')
  }
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }),
    name: body.name,
    description: body.description,
    workspace: workspaceId,
    createdBy: userId
  })
  await project.save()
  return { project }
}
