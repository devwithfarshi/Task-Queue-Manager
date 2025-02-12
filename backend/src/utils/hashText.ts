import bcrypt from 'bcryptjs'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'

export const hashText = async (text: string) => {
  if (!text) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Text to hash is required')
  }
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(text, salt)
}

export const verifyHash = async (text: string, hash: string) => {
  if (!text || !hash) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Text and Hash is required')
  }
  return await bcrypt.compare(text, hash)
}
