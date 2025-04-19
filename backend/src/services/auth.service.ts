import mongoose from 'mongoose'
import UserModel from '../models/user.model'
import AccountModel from '../models/account.model'
import RoleModel from '../models/roles-permission.model'
import { Roles } from '../enums/role.enum'
import { NotFoundException } from '../utils/appError'
import MemberModel from '../models/member.model'

export const loginOrCreateAccountService = async (data: {
  provider: string
  displayName: string
  providerId: string
  picture?: string
  email?: string
}) => {
  const { providerId, provider, displayName, email, picture } = data
  const session = await mongoose.startSession()
  try {
    const session = await mongoose.startSession()
    console.log('Started Session...')
    let user = await UserModel.findOne({ email }).session(session)

    if (!user) {
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null
      })
      await user.save({ session })

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId
      })
      await account.save({ session })

      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id
      })
      await workspace.save({ session })

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER
      }).session(session)

      if (!ownerRole) {
        throw new NotFoundException('Owner role not found')
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date()
      })
      await member.save({ session })

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId
      await user.save({ session })
      return { user }
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  } finally {
    session.endSession()
  }
}
