import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../utils/ApiError'
import ApiResponse from '../../utils/ApiResponse'
import catchAsync from '../../utils/catchAsync'
import emailTaskServices from './emailTask.services'
import { emailTaskQueue } from '../../Queues/emailTaskQueue'

const createEmailTask: RequestHandler = catchAsync(async (req, res) => {
  const task = await emailTaskServices.createEmailTask({
    ...req.body,
    userId: req.user?._id
  })

  if (!task) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Task not created')
  }
  await emailTaskQueue.add('email-task', {
    taskId: task._id.toString()
  })
  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(StatusCodes.CREATED, task, 'Task created successfully')
    )
})

const getEmailTasks: RequestHandler = catchAsync(async (req, res) => {
  const tasks = await emailTaskServices.getEmailTasks()
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, tasks, 'Tasks fetched successfully'))
})

const getEmailTaskById: RequestHandler = catchAsync(async (req, res) => {
  const task = await emailTaskServices.getEmailTaskById(req.params.id)
  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found')
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, task, 'Task fetched successfully'))
})

const getEmailTaskByUserId: RequestHandler = catchAsync(async (req, res) => {
  const tasks = await emailTaskServices.getEmailTasks({
    userId: req.params.userId.toString()
  })
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, tasks, 'Tasks fetched successfully'))
})

const getOwnEmailTasks: RequestHandler = catchAsync(async (req, res) => {
  const tasks = await emailTaskServices.getEmailTasks({
    userId: req.user?._id
  })
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, tasks, 'Tasks fetched successfully'))
})

const updateEmailTask: RequestHandler = catchAsync(async (req, res) => {
  const existingTask = await emailTaskServices.getEmailTaskById(req.params.id)
  if (existingTask?.status !== 'pending') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Task cannot be updated, it is already in progress.'
    )
  }
  const task = await emailTaskServices.updateEmailTask(req.params.id, req.body)
  if (!task) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Task not updated, try again')
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, task, 'Task updated successfully'))
})

const deleteEmailTask: RequestHandler = catchAsync(async (req, res) => {
  const existingTask = await emailTaskServices.getEmailTaskById(req.params.id)
  if (existingTask?.status !== 'pending') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Task cannot be deleted, it is already in progress.'
    )
  }
  const task = await emailTaskServices.deleteEmailTask(req.params.id)
  if (!task) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Task not deleted, try again')
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, task, 'Task deleted successfully'))
})

export default {
  createEmailTask,
  getEmailTasks,
  getEmailTaskById,
  updateEmailTask,
  deleteEmailTask,
  getEmailTaskByUserId,
  getOwnEmailTasks
}
