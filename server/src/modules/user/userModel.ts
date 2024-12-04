import mongoose, { Schema, Document } from 'mongoose'
import { USER_ROLE } from '../../config/constant'

const userSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: USER_ROLE,
      default: 'user'
    }
  },
  { timestamps: true }
)

const UserModel = mongoose.model<IUser & Document>('User', userSchema)

export default UserModel
