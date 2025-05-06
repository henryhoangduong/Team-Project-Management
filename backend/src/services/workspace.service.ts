import mongoose from 'mongoose'
import { Roles } from '../enums/role.enum'
import MemberModel from '../models/member.model'
import RoleModel from '../models/roles-permission.model'
import UserModel from '../models/user.model'
import WorkSpaceModel from '../models/workspace.model'
import { BadRequestException, NotFoundException } from '../utils/appError'
import ProjectModel from '../models/project.model'
import TaskModel from '../models/task.model'

//********************************
// CREATE NEW WORKSPACE
//**************** **************/
export const createWorkspaceService = async (
  userId: string,
  body: {
    name: string
    description?: string | null
  }
) => {
  const { name, description } = body
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new NotFoundException('User not found')
  }
  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER })

  if (!ownerRole) {
    throw new NotFoundException('Owner role not found')
  }
  const workspace = new WorkSpaceModel({
    name: name,
    description: description,
    owner: user._id
  })
  await workspace.save()

  const member = new MemberModel({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole._id,
    joinedAt: new Date()
  })
  await member.save()
  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId
  await user.save()

  return {
    workspace
  }
}

export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memebership = await MemberModel.find({ userId }).populate('workspaceId').select('-password').exec()

  const workspaces = memebership.map((memebership) => memebership.workspaceId)
  return { workspaces }
}

export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await WorkSpaceModel.findById(workspaceId)
  if (!workspace) {
    throw new NotFoundException('Workspace not found')
  }
  const members = await MemberModel.find({
    workspaceId
  }).populate('role')

  const workspaceWithMembers = {
    ...workspace.toObject(),
    members
  }

  return {
    workspace: workspaceWithMembers
  }
}

//********************************
// UPDATE WORKSPACCE
//**************** **************/
export const updateWorkspaceByIdService = async (workspaceId: string, name: string, description?: string) => {
  const workspace = await WorkSpaceModel.findById(workspaceId)
  if (!workspace) {
    throw new NotFoundException('Workspace not found')
  }
  workspace.name = name || workspace.name
  workspace.description = description || workspace.description
  await workspace.save()
  return {
    workspace
  }
}

//********************************
// DELETE WORKSPACCE
//**************** **************/
export const deleteWorkspaceService = async (workspaceId: string, userId: string) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const workspace = await WorkSpaceModel.findById(workspaceId).session(session)
    if (!workspace) {
      throw new NotFoundException('Workspace not found')
    }
    if (!workspace.owner.equals(new mongoose.Types.ObjectId(userId))) {
      throw new BadRequestException('You are not authorized to delete this workspace')
    }
    const user = await UserModel.findById(userId).session(session)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    await ProjectModel.deleteMany({ workspace: workspace._id }).session(session)
    await TaskModel.deleteMany({ workspace: workspace._id }).session(session)
    await MemberModel.deleteMany({
      workspaceId: workspace._id
    }).session(session)
    if (user?.currentWorkspace?.equals(workspaceId)) {
      const memberWorkspace = await MemberModel.findOne({ userId }).session(session)
      // Update the user's currentWorkspace
      user.currentWorkspace = memberWorkspace ? memberWorkspace.workspaceId : null

      await user.save({ session })
    }
    await workspace.deleteOne({ session })

    await session.commitTransaction()

    session.endSession()

    return {
      currentWorkspace: user.currentWorkspace
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}
