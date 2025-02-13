import 'dotenv/config'
import { Worker } from 'bullmq'
import transporter from '../../config/email'

const worker = new Worker('email-queue', async (job) => {
  const { mailOptions } = job.data
  await transporter.sendMail(mailOptions)
})

worker.on('failed', async (job) => {
  console.log(`Email send failed for ${job?.id}. - ${job?.data.mailOptions.to}`)
})
