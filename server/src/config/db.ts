import mongoose from 'mongoose'

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: 'Task-queue'
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error}`)
    process.exit(1)
  }
}

export default ConnectDB
