import express from 'express'
import { StatusCodes } from 'http-status-codes'
import cors from 'cors'
const app = express()
const port = process.env.PORT || 3000

// middleware
const allMiddleware = [
  express.json(),
  express.urlencoded({ extended: true }),
  cors()
]

app.use(allMiddleware)

// base route ; add emoji to the message
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Api is running 🚀',
    time: new Date().toLocaleString()
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
