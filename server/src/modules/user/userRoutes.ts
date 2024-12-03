import express from 'express'
import userController from './userController'
import { validate } from '../../middleware/validationMiddleware'
import userValidation from './userValidation'
import authenticate from '../../middleware/authMiddleware'
const router = express.Router()

router.post(
  '/register',
  validate(userValidation.userRegistrationSchema),
  userController.createUser
)

router.post(
  '/login',
  validate(userValidation.userLoginSchema),
  userController.userSignIn
)

router.get('/me', authenticate, userController.me)

export default router
