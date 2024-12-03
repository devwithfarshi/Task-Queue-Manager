import dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import app from './app'
import ConnectDB from './config/db'
export const BASE_URL = '/api/v1' as const
ConnectDB()

// Start the server
const PORT = process.env.PORT || 3000
http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`Base URL: http://localhost:${PORT}${BASE_URL}`)
})
