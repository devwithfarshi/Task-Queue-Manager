import express from 'express'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'
import { errorHandler, notFoundHandler } from './utils/errorHandlers'
import ApiResponse from './utils/ApiResponse'

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
app.get('/', (_, res) => {
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      message: 'Welcome to the Task Queue Manager API😀',
      status: 'Success✅',
      server_status: 'Working🆙',
      server_time: `${new Date().toLocaleString()}⌛`
    })
  )
})

// error handlers
app.use(notFoundHandler)
app.use(errorHandler)

export default app
