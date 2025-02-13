import 'dotenv/config'
import redisConnection from '../config/redisConfig'
import EmailTaskModel from '../modules/emailTask/emailTask.model'
import { Worker } from 'bullmq'
import emailQueue from './emailServices/emailQueue'
import sendEmail from '../utils/sendEmail'
const worker = new Worker<{ taskId: string }>(
  'email-task-queue',
  async (job) => {
    console.log('Email task Processing for : ', job.id)
    const emailTask = await EmailTaskModel.findById(job.data.taskId)
    if (!emailTask) {
      throw new Error('Email Task not found')
    }
    emailTask.status = 'in-progress'
    await emailTask.save()
    await Promise.all(
      Array(emailTask.howMuchMessage)
        .fill(null)
        .map(() =>
          sendEmail(emailTask.email, emailTask.subject, 'emailTask', {
            message: emailTask.message
          })
        )
    )
  },
  {
    connection: redisConnection
  }
)
