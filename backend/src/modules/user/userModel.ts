import mongoose, { Document, Schema } from 'mongoose'
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
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    passwordResetToken: String,
    passwordResetExpiry: Date
  },
  { timestamps: true }
)
userSchema.index(
  {
    emailVerificationExpiry: 1
  },
  { expireAfterSeconds: 0 }
)
const UserModel = mongoose.model<IUser & Document>('User', userSchema)

export default UserModel
