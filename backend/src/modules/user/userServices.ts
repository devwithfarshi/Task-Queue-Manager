import { StatusCodes } from 'http-status-codes'
import ApiError from '../../utils/ApiError'
import { generateCode } from '../../utils/generateCode'
import { hashText, verifyHash } from '../../utils/hashText'
import sendEmail from '../../utils/sendEmail'
import UserModel from './userModel'

const createUser = async (data: IUser) => {
  const hashPassword = await hashText(data.password)
  data.password = hashPassword
  const isAlreadyExist = await UserModel.findOne({ email: data.email })
  if (isAlreadyExist) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'You already register with this email address'
    )
  }
  const verificationToken = generateCode(6)
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  const save = await UserModel.create({
    ...data,
    role: 'user',
    emailVerificationToken: verificationToken,
    emailVerificationExpiry: verificationExpiry
  })
  if (!save || save === null) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      "User Info can't save, their might be an issues while data"
    )
  }

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
  await sendEmail(data.email, 'Email Verification', 'verification', {
    verificationUrl,
    username: data.username
  })

  return save
}

const verifyEmail = async (token: string) => {
  const user = await UserModel.findOne({
    emailVerificationToken: token,
    emailVerificationExpiry: { $gt: Date.now() }
  })
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid or expired token')
  }
  user.isEmailVerified = true
  user.emailVerificationToken = undefined
  user.emailVerificationExpiry = undefined
  await user.save()
  return user
}

const findUser = async (identifier: IUser['_id'] | IUser['email']) => {
  const user = await UserModel.findOne({
    $or: [{ _id: identifier }, { email: identifier }]
  }).select('-password')

  if (!user || user === null) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  return user
}

// get User profile

const me = async (userId: IUser['_id']) => {
  const user = await UserModel.findById(userId).select('-password')
  if (!user || user === null) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  return user
}

// Sign In User

const signInUser = async (
  data: Pick<IUser, 'username' | 'email' | 'password'>
) => {
  let user: IUser | null = null

  user = await UserModel.findOne(
    data.username?.length > 0
      ? { username: data.username }
      : { email: data.email }
  ).select('+password')

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Credentials not match')
  }
  if (!user.isEmailVerified) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Please verify your email before signing in'
    )
  }

  const isPasswordMatch = await verifyHash(data.password, user.password)
  if (!isPasswordMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Credentials not match')
  }

  return user
}

const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email })

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No user found with this email address'
    )
  }

  const resetToken = generateCode(6)
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  user.passwordResetToken = resetToken
  user.passwordResetExpiry = resetExpiry
  await user.save()

  try {
    await sendEmail(email, 'Reset Your Password', 'password-reset', {
      username: user.username,
      otp: resetToken
    })

    return user
  } catch (error) {
    user.passwordResetToken = undefined
    user.passwordResetExpiry = undefined
    await user.save()
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error sending password reset email'
    )
  }
}

const resetPassword = async (data: { token: string; newPassword: string }) => {
  const user = await UserModel.findOne({
    passwordResetToken: data.token,
    passwordResetExpiry: { $gt: Date.now() }
  })

  if (!user) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Invalid or expired password reset token'
    )
  }

  const hashedPassword = await hashText(data.newPassword)
  user.password = hashedPassword
  user.passwordResetToken = undefined
  user.passwordResetExpiry = undefined
  await user.save()

  return user
}

export default {
  createUser,
  findUser,
  signInUser,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword
}
