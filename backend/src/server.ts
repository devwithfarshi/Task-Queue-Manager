import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'
import app from './app'
import ConnectDB from './config/db'
export const BASE_URL = '/api/v1' as const
ConnectDB()
const server = http.createServer(app)
export const userSockets = new Map<string, string>()

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('authenticate', (userId: string) => {
    userSockets.set(userId, socket.id)
    console.log(`User ${userId} authenticated with socket ${socket.id}`)
  })

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId)
        console.log(`User ${userId} disconnected`)
        break
      }
    }
  })
})
// Start the server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`Base URL: http://localhost:${PORT}${BASE_URL}`)
})
