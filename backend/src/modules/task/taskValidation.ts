import { z } from 'zod'
import { TASK_PRIORITY, TASK_STATUS } from '../../config/constant'

const createTask = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  status: z.enum(TASK_STATUS).default('pending').optional().nullable(),
  priority: z.enum(TASK_PRIORITY).default('medium').optional().nullable(),
  dueDate: z.string().optional().nullable()
})

export default {
  createTask
}
