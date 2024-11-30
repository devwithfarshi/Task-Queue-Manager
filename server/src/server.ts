import dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import app from './app'

// Start the server
const PORT = process.env.PORT || 3000
http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
