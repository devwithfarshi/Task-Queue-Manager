import { Queue } from 'bullmq'
import 'dotenv/config'
import redisConnection from '../config/redisConfig'
import './emailTaskWorker'
export const emailTaskQueue = new Queue('email-task-queue', {
  connection: redisConnection
})
