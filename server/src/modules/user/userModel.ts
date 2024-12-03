import mongoose, { Schema, Document } from 'mongoose'

const userSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user', 'moderator'],
      default: 'user'
    }
  },
  { timestamps: true }
)

const UserModel = mongoose.model<IUser & Document>('User', userSchema)

export default UserModel
