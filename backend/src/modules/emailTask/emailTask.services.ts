import EmailTaskModel from './emailTask.model'

const createEmailTask = async (data: IEmailTask) => {
  return await EmailTaskModel.create(data)
}

const getEmailTasks = async (filter: Partial<IEmailTask> = {}) => {
  return await EmailTaskModel.find(filter).populate(
    'userId',
    'username email role'
  )
}

const getEmailTaskById = async (id: string): Promise<IEmailTask | null> => {
  return (await EmailTaskModel.findById(id).populate(
    'userId'
  )) as unknown as IEmailTask
}

const updateEmailTask = async (id: string, data: IEmailTask) => {
  return await EmailTaskModel.findByIdAndUpdate(id, data, {
    new: true
  })
}

const deleteEmailTask = async (id: string) => {
  return await EmailTaskModel.findByIdAndDelete(id)
}

export default {
  createEmailTask,
  getEmailTasks,
  getEmailTaskById,
  updateEmailTask,
  deleteEmailTask
}
