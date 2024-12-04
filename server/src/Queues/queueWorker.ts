import 'dotenv/config'
import { Worker } from 'bullmq'
import TaskModel from '../modules/task/taskModel'

const worker = new Worker(
  'task-queue',
  async (job) => {
    console.log('Processing job', job.id)
    const task = await TaskModel.findById(job.data.taskId)
    if (!task) {
      throw new Error('Task not found')
    }
    task.status = 'in-progress'
    await new Promise((resolve) => setTimeout(resolve, 10000))
    task.status = 'completed'
    await task.save()
    console.log('Completed job', job.id)
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT!)
    }
  }
)

worker.on('failed', async (job) => {
  const task = await TaskModel.findById(job?.data.taskId)
  if (task) {
    task.status = 'failed'
    await task.save()
  }
})
