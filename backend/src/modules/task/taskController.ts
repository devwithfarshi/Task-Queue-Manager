import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { taskQueue } from '../../Queues/queueServices'
import '../../Queues/queueWorker'
import ApiError from '../../utils/ApiError'
import ApiResponse from '../../utils/ApiResponse'
import catchAsync from '../../utils/catchAsync'
import taskService from './taskService'

const createTask: RequestHandler = catchAsync(async (req, res) => {
  const task = await taskService.createTask({
    ...req.body,
    userId: req.user?._id
  })

  if (!task) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Task not created')
  }
  await taskQueue.add('task', {
    taskId: task._id.toString()
  })
  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(StatusCodes.CREATED, task, 'Task created successfully')
    )
})

const getTasks: RequestHandler = catchAsync(async (req, res) => {
  const tasks = await taskService.getTasks()
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, tasks, 'Tasks fetched successfully'))
})

const getTaskById: RequestHandler = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id)
  if (!task) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found')
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, task, 'Task fetched successfully'))
})

const getTasksByUserId: RequestHandler = catchAsync(async (req, res) => {
  const tasks = await taskService.getTasks({
    userId: req.params.userId.toString()
  })
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, tasks, 'Tasks fetched successfully'))
})

const updateTask: RequestHandler = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body)
  if (!task) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Task not updated, try again')
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, task, 'Task updated successfully'))
})

const cancelTaskStatus: RequestHandler = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id)

  if (!task || !task._id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Task not found')
  }

  if (task.status === 'completed') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'This task is already completed'
    )
  }

  if (task.status === 'canceled') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'This task is already canceled')
  }

  await taskQueue.remove(task._id.toString())

  task.status = 'canceled'

  if (!task._id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Task ID is undefined')
  }
  const updatedTask = await taskService.updateTask(task._id.toString(), task)

  if (!updatedTask) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update task')
  }

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, updatedTask, 'Task canceled successfully')
    )
})

const deleteTask: RequestHandler = catchAsync(async (req, res) => {
  const task = await taskService.deleteTask(req.params.id)
  if (!task) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Task not deleted, try again')
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, task, 'Task deleted successfully'))
})

const getTaskQueueStatus: RequestHandler = catchAsync(async (req, res) => {
  const counts = await taskQueue.getJobCounts()
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, counts, 'Task Queue Status'))
})

export default {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUserId,
  cancelTaskStatus,
  getTaskQueueStatus
}
