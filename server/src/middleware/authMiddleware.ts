import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError'
import { verifyAccessToken } from '../utils/jwtToken'
import userServices from '../modules/user/userServices'
type token = string | null
const extractToken = (req: Request): string => {
  let token: token = null
  if (req.headers.authorization) {
    token =
      typeof req.headers.authorization === 'string' &&
      req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'] as string
  }

  return token as string
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req)
  if (!token) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Access denied. No token provided')
    )
  }

  try {
    const decoded = verifyAccessToken(token)
    const userExits = await userServices.findUser(decoded._id)
    if (!userExits) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expire token')
      )
    }

    req.user = userExits
    next()
  } catch (err) {
    console.log(`Error while verifying token: ${err}`)
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expire token provided')
    )
  }
}

export default authenticate
