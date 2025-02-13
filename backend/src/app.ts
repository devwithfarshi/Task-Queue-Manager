import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import { StatusCodes } from 'http-status-codes'
import morgan from 'morgan'
import ApiResponse from './utils/ApiResponse'
import { errorHandler, notFoundHandler } from './utils/errorHandlers'

const app = express()

// middleware
const allMiddleware = [
  morgan(process.env.LOGGER_LEVEL === 'development' ? 'dev' : 'combined'),
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20000
  }),
  mongoSanitize(),
  hpp(),
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(),
  cors()
]

app.use(allMiddleware)

// base route
app.get(`/`, (_, res) => {
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      message: 'Welcome to the Task Queue Manager API😀',
      status: 'Success✅',
      server_status: 'Working🆙',
      server_time: `${new Date().toLocaleString()}⌛`
    })
  )
})

app.get('/api/v1', (_, res) => {
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      message: 'Welcome to the Task Queue Manager API😀',
      status: 'Success✅',
      server_status: 'Working🆙',
      server_time: `${new Date().toLocaleString()}⌛`
    })
  )
})

// routes
import userRouter from './modules/user/userRoutes'
import taskRouter from './modules/task/taskRoutes'
import emailTaskRouter from './modules/emailTask/emailTask.routes'
app.use(`/api/v1/auth`, userRouter)
app.use(`/api/v1/task`, taskRouter)
app.use(`/api/v1/email-task`, emailTaskRouter)

// error handlers
app.use(notFoundHandler)
app.use(errorHandler)

export default app
