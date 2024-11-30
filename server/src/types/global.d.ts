declare global {
  type UserRole = 'admin' | 'user' | 'moderator'

  type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed'

  interface IUser {
    _id: string
    username: string
    email: string
    password: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
    tasks?: ITask[]
  }

  interface ITask {
    _id: string
    title: string
    description: string
    status: TaskStatus
    dueDate: Date
    createdAt: Date
    updatedAt: Date
    user: IUser
  }
}

export {}
