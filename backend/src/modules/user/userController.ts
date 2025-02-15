import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../utils/ApiError'
import ApiResponse from '../../utils/ApiResponse'
import catchAsync from '../../utils/catchAsync'
import { generateAccessToken } from '../../utils/jwtToken'
import userServices from './userServices'

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const user = await userServices.createUser(req.body)
  if (!user || user === null) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }

  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        { _id: user._id },
        'Account created successfully, please verify your email'
      )
    )
})

const userSignIn: RequestHandler = catchAsync(async (req, res) => {
  const user = await userServices.signInUser(req.body)
  if (!user || user === null) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong'
    )
  }

  const accessToken = generateAccessToken(user)

  res
    .status(StatusCodes.OK)
    .cookie('token', accessToken)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { _id: user._id, accessToken },
        'User signed in successfully'
      )
    )
})

const me: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user || req.user === null) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
  }
  const user = await userServices.me(req.user._id)
  if (!user || user === null) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, 'User profile'))
})

const verifyEmail: RequestHandler = catchAsync(async (req, res) => {
  const user = await userServices.verifyEmail(req.params.token)
  if (!user || user === null) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Email verified successfully'))
})
const forgotPassword: RequestHandler = catchAsync(async (req, res) => {
  const user = await userServices.forgotPassword(req.body.email)
  if (!user || user === null) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Password reset link sent'))
})
const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const user = await userServices.resetPassword(req.body)
  if (!user || user === null) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Password reset successfully'))
})
export default {
  createUser,
  userSignIn,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword
}
