import TaskModel from './taskModel'

const createTask = async (data: ITask) => {
  return await TaskModel.create(data)
}

const getTasks = async (filter: Partial<ITask> = {}) => {
  return await TaskModel.find(filter).populate('userId', 'username email role')
}

const getTaskById = async (id: string): Promise<ITask | null> => {
  return (await TaskModel.findById(id).populate('userId')) as unknown as ITask
}

const updateTask = async (id: string, data: ITask) => {
  return await TaskModel.findByIdAndUpdate(id, data, {
    new: true
  })
}

const deleteTask = async (id: string) => {
  return await TaskModel.findByIdAndDelete(id)
}

export default {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
}
