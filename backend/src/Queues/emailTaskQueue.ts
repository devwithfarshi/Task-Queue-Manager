import 'dotenv/config'
import { Queue } from 'bullmq'
import redisConnection from '../config/redisConfig'
export const emailTaskQueue = new Queue('email-task-queue', {
  connection: redisConnection
})
