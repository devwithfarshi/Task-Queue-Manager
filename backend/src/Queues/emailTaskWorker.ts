import { Worker } from 'bullmq'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import transporter from '../config/email'
import Handlebars from 'handlebars'
import redisConnection from '../config/redisConfig'
import EmailTaskModel from '../modules/emailTask/emailTask.model'
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
    const templatePath = path.join(__dirname, '../templates', `emailTask.html`)
    const source = fs.readFileSync(templatePath, 'utf8')
    const template = Handlebars.compile(source)
    const html = template({ message: emailTask.message })
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailTask.email,
      subject: emailTask.subject,
      html
    }
    for (let i = 0; i < emailTask.howMuchMessage; i++) {
      await transporter.sendMail(mailOptions)
      if (i < emailTask.howMuchMessage - 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }
  },
  {
    connection: redisConnection
  }
)

worker.on('failed', async (job, err) => {
  console.log(`Email Task ${job?.id} failed with ${err.message}`)
  await EmailTaskModel.findByIdAndUpdate(job?.data.taskId, {
    status: 'failed'
  })
})

worker.on('completed', async (job) => {
  console.log(`Email Task ${job.id} completed`)
  await EmailTaskModel.findByIdAndUpdate(job.data.taskId, {
    status: 'completed'
  })
})
