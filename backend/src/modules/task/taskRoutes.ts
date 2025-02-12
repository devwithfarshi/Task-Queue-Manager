import adminRequired from '../../middleware/adminMiddleware'
import { Router } from 'express'
import taskController from './taskController'
import authenticate from '../../middleware/authMiddleware'
import taskValidation from './taskValidation'
import { validate } from '../../middleware/validationMiddleware'
import hasPermission from '../../middleware/hasPermission'
const router = Router()

router.post(
  '/create',
  authenticate,
  validate(taskValidation.createTask),
  taskController.createTask
)

// get all tasks by user id ; only admin or owner of the task can view
router.get(
  '/:userId',
  authenticate,
  hasPermission(['admin']),
  taskController.getTasksByUserId
)

// get task by id ; only admin or owner of the task can view
router.get(
  '/:id/user/:userId',
  authenticate,
  hasPermission(['admin']),
  taskController.getTaskById
)

// update task by id ; only admin or owner of the task can update
router.put(
  '/:id/user/:userId',
  authenticate,
  hasPermission(['admin']),
  taskController.updateTask
)

// cancel task by id ; only admin
router.patch(
  '/:id/cancel',
  authenticate,
  adminRequired,
  taskController.cancelTaskStatus
)

// get all task by admin
router.get(
  '/get/all-tasks',
  authenticate,
  adminRequired,
  taskController.getTasks
)

router.get(
  '/queue/status',
  authenticate,
  adminRequired,
  taskController.getTaskQueueStatus
)

export default router
