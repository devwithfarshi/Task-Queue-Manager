import { Router } from 'express'
import authenticate from '../../middleware/authMiddleware'
import hasPermission from '../../middleware/hasPermission'
import emailTaskController from './emailTask.controller'
import emailTaskValidation from './emailTask.validation'
import { validate } from '../../middleware/validationMiddleware'

const router = Router()

router.post(
  '/create',
  authenticate,
  validate(emailTaskValidation.createEmailTask),
  emailTaskController.createEmailTask
)
router.get(
  '/',
  authenticate,
  hasPermission(['admin']),
  emailTaskController.getEmailTasks
)
router.get(
  '/task/:id',
  authenticate,
  hasPermission(['admin']),
  emailTaskController.getEmailTaskById
)
router.get(
  '/user/:userId',
  authenticate,
  hasPermission(['admin']),
  emailTaskController.getEmailTaskByUserId
)
router.get('/user', authenticate, emailTaskController.getOwnEmailTasks)
router.put(
  '/update/:id/user/:userId',
  authenticate,
  hasPermission(),
  validate(emailTaskValidation.updateEmailTask),
  emailTaskController.updateEmailTask
)
router.delete(
  '/delete/:id/user/:userId',
  authenticate,
  hasPermission(),
  emailTaskController.deleteEmailTask
)
export default router
