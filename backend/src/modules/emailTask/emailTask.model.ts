import { model, Schema } from 'mongoose'
import { TASK_STATUS } from '../../config/constant'

const EmailTask: Schema = new Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    howMuchMessage: { type: Number, required: true },
    status: {
      type: String,
      enum: TASK_STATUS,
      default: 'pending'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const EmailTaskModel = model<IEmailTask>('EmailTask', EmailTask)

export default EmailTaskModel
