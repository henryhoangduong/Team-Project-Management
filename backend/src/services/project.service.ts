import ProjectModel from '../models/project.model'
import TaskModel from '../models/task.model'
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
  console.log(body.emoji)

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

export const deleteProjectByIdService = async (workspaceId: string, projectId: string) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId
  })

  if (!project) {
    throw new NotFoundException('Project not found or does not belong to the specified workspace')
  }
  await project.deleteOne()

  await TaskModel.deleteMany({
    project: project._id
  })

  return project
}

export const getProjectByIdAndWorkspaceIdService = async (workspaceId: string, projectId: string) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId
  }).select('_id emoji name description')
  if (!project) {
    throw new NotFoundException('Project not found or does not belong to the specified workspace')
  }

  return { project }
}
