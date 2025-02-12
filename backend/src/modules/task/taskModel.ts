import { model, Schema } from 'mongoose'
import { TASK_PRIORITY, TASK_STATUS } from '../../config/constant'

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: TASK_STATUS,
      default: 'pending'
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY,
      default: 'medium'
    },
    dueDate: { type: Date },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const TaskModel = model<ITask>('Task', TaskSchema)

export default TaskModel
