import { Worker } from 'bullmq'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import transporter from '../../config/email'
import redisConnection from '../../config/redisConfig'

const worker = new Worker(
  'email-queue',
  async (job) => {
    const { mailOptions } = job.data
    // const { subject, templateName, to, context } = job.data
    // const templatePath = path.join(
    //   __dirname,
    //   '../../templates',
    //   `${templateName}.html`
    // )
    // const source = fs.readFileSync(templatePath, 'utf8')
    // const template = Handlebars.compile(source)
    // const html = template(context)
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to,
    //   subject,
    //   html
    // }
    await transporter.sendMail(mailOptions)
  },
  {
    connection: redisConnection
  }
)

worker.on('failed', async (job) => {
  console.log(`Email send failed for ${job?.id}. - ${job?.data.mailOptions.to}`)
})
