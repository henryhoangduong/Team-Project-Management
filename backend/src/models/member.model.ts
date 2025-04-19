import mongoose, { Schema, Document } from 'mongoose'
import { generateTaskCode } from '../utils/uuid'

export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId
  workspaceId: mongoose.Types.ObjectId
  joinedAt: Date
  role: RoleDocument
}

const memberSchema = new Schema<MemberDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

const MemberModel = mongoose.model<MemberDocument>('Member', memberSchema)
export default MemberModel
