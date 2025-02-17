import { io, userSockets } from '../server'

export const emitTaskStatusUpdate = (
  userId: string,
  taskId: string,
  status: string
) => {
  const socketId = userSockets.get(userId)
  if (socketId) {
    io.to(socketId).emit('task-status-update', {
      taskId,
      status,
      timestamp: new Date().toISOString()
    })
  }
}
