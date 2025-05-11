import ProjectModel from '../models/project.model'
import UserModel from '../models/user.model'
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

export const getAllProjectsInWorkspaceService = async (workspaceId: string, pageSize: number, pageNumber: number) => {
  const workspace = WorkSpaceModel.findById(workspaceId)
  if (!workspace) {
    throw new NotFoundException('Workspace does not exist')
  }
  const totalCount = await ProjectModel.countDocuments({
    workspace: workspaceId
  })
  const skip = (pageNumber - 1) * pageSize

  const projects = await ProjectModel.find({
    workspace: workspaceId
  })
    .skip(skip)
    .limit(pageSize)
    .populate('createdBy', '_id name profilePicture -password')
    .sort({ createdAt: -1 })
  const totalPages = Math.ceil(totalCount / pageSize)

  return { projects, totalCount, totalPages, skip }
}
