import 'dotenv/config'
import { Queue } from 'bullmq'
import redisConnection from '../config/redisConfig'
export const taskQueue = new Queue('task-queue', {
  connection: redisConnection
})
