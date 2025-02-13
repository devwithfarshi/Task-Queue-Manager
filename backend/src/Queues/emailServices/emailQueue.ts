import { Queue } from 'bullmq'
import 'dotenv/config'
import redisConnection from '../../config/redisConfig'
const emailQueue = new Queue('email-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true
  }
})

export default emailQueue
