import { StatusCodes } from 'http-status-codes'
import ApiError from '../../utils/ApiError'
import { hashText, verifyHash } from '../../utils/hashText'
import UserModel from './userModel'

const createUser = async (data: IUser) => {
  const hashPassword = await hashText(data.password)
  data.password = hashPassword
  // Manual Email Verification
  const isAlreadyExist = await UserModel.findOne({ email: data.email })
  if (isAlreadyExist) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'You already register with this email address'
    )
  }
  const save = await UserModel.create({
    ...data,
    role: 'user'
  })
  if (!save || save === null) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      "User Info can't save, their might be an issues while data"
    )
  }

  //   TODO: Send Email Verification Link

  return save
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
  ).select('+password -__v -createdAt -updatedAt')

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Credentials not match')
  }

  const isPasswordMatch = await verifyHash(data.password, user.password)
  if (!isPasswordMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Credentials not match')
  }

  return user
}

export default {
  createUser,
  findUser,
  signInUser,
  me
}
