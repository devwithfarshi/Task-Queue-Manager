import { Worker } from 'bullmq'
import 'dotenv/config'
import redisConnection from '../config/redisConfig'
import EmailTaskModel from '../modules/emailTask/emailTask.model'
import { emitTaskStatusUpdate } from '../utils/emitTaskStatusUpdate'
import sendEmail from '../utils/sendEmail'
const worker = new Worker<{ taskId: string }>(
  'email-task-queue',
  async (job) => {
    console.log('Email task Processing for : ', job.id)
    const emailTask = await EmailTaskModel.findById(job.data.taskId)
    if (!emailTask) {
      throw new Error('Email Task not found, When processing email task.')
    }
    emailTask.status = 'in-progress'
    await emailTask.save()
    emitTaskStatusUpdate(
      emailTask.userId?.toString() || '',
      emailTask.id,
      'in-progress'
    )
    for (let i = 0; i < emailTask.howMuchMessage; i++) {
      await sendEmail(emailTask.email, emailTask.subject, 'emailTask', {
        message: emailTask.message
      })
      if (i < emailTask.howMuchMessage - 1) {
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    }
  },
  {
    connection: redisConnection
  }
)

worker.on('failed', async (job, err) => {
  console.log(`Email Task ${job?.id} failed with ${err.message}`)
  const emailTask = await EmailTaskModel.findByIdAndUpdate(job?.data.taskId, {
    status: 'failed'
  })
  if (emailTask) {
    emitTaskStatusUpdate(
      emailTask.userId?.toString() || '',
      emailTask.id,
      'failed'
    )
  }
})

worker.on('completed', async (job) => {
  console.log(`Email Task ${job.id} completed`)
  const emailTask = await EmailTaskModel.findByIdAndUpdate(job.data.taskId, {
    status: 'completed'
  })

  if (emailTask) {
    emitTaskStatusUpdate(
      emailTask.userId?.toString() || '',
      emailTask.id,
      'completed'
    )
  }
})
