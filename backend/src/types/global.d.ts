import mongoose from 'mongoose'
import { T_TASK_PRIORITY, T_TASK_STATUS, T_USER_ROLE } from '../config/constant'

declare global {
  interface IUser {
    _id?: string
    username: string
    email: string
    password: string
    role: T_USER_ROLE
    createdAt?: Date
    updatedAt?: Date
    isEmailVerified: boolean
    emailVerificationToken?: string
    emailVerificationExpiry?: Date
    passwordResetToken?: string
    passwordResetExpiry?: Date
  }

  interface ITask {
    _id?: mongoose.Types.ObjectId | string
    title: string
    description: string
    status: T_TASK_STATUS
    priority: T_TASK_PRIORITY
    dueDate: Date
    createdAt?: Date
    updatedAt?: Date
    userId?: IUser['_id']
    priority: 'low' | 'medium' | 'high'
  }
  interface IEmailTask {
    _id?: mongoose.Types.ObjectId | string
    email: string
    subject: string
    message: string
    howMuchMessage: number
    status: T_TASK_STATUS
    userId: IUser['_id']
    createdAt?: Date
    updatedAt?: Date
  }
}

export {}
