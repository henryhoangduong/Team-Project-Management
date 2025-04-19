import 'dotenv/config'
import { RolePermissions } from './../utils/role-permissions'
import mongoose from 'mongoose'
import RoleModel from '../models/roles-permission.model'
import connectDatabase from '../config/database.config'
const seedRoles = async () => {
  console.log('Seeding roles started...')

  try {
    await connectDatabase()
    const session = await mongoose.startSession()
    session.startTransaction()

    console.log('Clearing existing roles')
    await RoleModel.deleteMany({}, { session })

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions
      const permissions = RolePermissions[role]
      const existingRole = await RoleModel.findOne({
        name: role
      }).session(session)

      if (!existingRole) {
        const newRole = new RoleModel({
          name: role,
          permissions: permissions
        })
        await newRole.save({ session })
        console.log(`Role ${role} added with permissions`)
      }
      {
        console.log(`Role ${role} already exists`)
      }
    }

    await session.commitTransaction()
    console.log('Transaction committed')

    await session.endSession()
    console.log('Session ended')

    console.log('Seeding ended successflly')
  } catch (error) {
    console.log('Error during sedding: ', error)
  }
}

seedRoles().catch((error) => {
  console.log('Error runing seed script: ', error)
})
