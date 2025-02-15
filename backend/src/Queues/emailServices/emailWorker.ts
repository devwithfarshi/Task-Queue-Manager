import { Worker } from 'bullmq'
import 'dotenv/config'
import transporter from '../../config/email'
import redisConnection from '../../config/redisConfig'

const worker = new Worker(
  'email-queue',
  async (job) => {
    const { mailOptions } = job.data
    await transporter.sendMail(mailOptions)
  },
  {
    connection: redisConnection
  }
)

worker.on('failed', async (job) => {
  console.log(`Email send failed for ${job?.id}. - ${job?.data.mailOptions.to}`)
})
