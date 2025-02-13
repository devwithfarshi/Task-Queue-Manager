import { Worker } from 'bullmq'
import 'dotenv/config'
import TaskModel from '../modules/task/taskModel'
import redisConnection from '../config/redisConfig'

const worker = new Worker(
  'task-queue',
  async (job) => {
    console.log('Processing job', job.id)
    const task = await TaskModel.findById(job.data.taskId)
    if (!task) {
      throw new Error('Task not found')
    }
    task.status = 'in-progress'
    await task.save()
    const waitTime = 30000
    console.log('Waiting for', waitTime, 'ms')
    await new Promise((resolve) => setTimeout(resolve, waitTime))
    task.status = 'completed'
    await task.save()
    console.log('Completed job', job.id)
  },
  {
    connection: redisConnection
  }
)

worker.on('failed', async (job) => {
  const task = await TaskModel.findById(job?.data.taskId)
  if (task) {
    task.status = 'failed'
    await task.save()
  }
})
