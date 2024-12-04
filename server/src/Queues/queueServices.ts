import 'dotenv/config'
import { Queue } from 'bullmq'

export const taskQueue = new Queue('task-queue', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!)
  }
})
