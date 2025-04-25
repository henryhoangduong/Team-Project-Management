import mongoose from 'mongoose'
import { Roles } from '../enums/role.enum'
import MemberModel from '../models/member.model'
import RoleModel from '../models/roles-permission.model'
import UserModel from '../models/user.model'
import WorkSpaceModel from '../models/workspace.model'
import { NotFoundException } from '../utils/appError'

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
