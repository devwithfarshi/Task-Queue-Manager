import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import emailQueue from '../Queues/emailServices/emailQueue'
import transporter from '../config/email'

const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  context: Record<string, string | number>
) => {
  const templatePath = path.join(
    __dirname,
    '../templates',
    `${templateName}.html`
  )
  const source = fs.readFileSync(templatePath, 'utf8')
  const template = Handlebars.compile(source)
  const html = template(context)
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  }

  try {
    let info
    if (process.env.REDIS_HOST) {
      info = await emailQueue.add('email', { mailOptions })
      console.log('Email service using Redis')
      return info
    } else {
      info = await transporter.sendMail(mailOptions)
      console.log('Email service using Nodemailer')
      return info
    }
  } catch (error) {
    console.error('Error sending email: ', error)
    throw error
  }
}

export default sendEmail
