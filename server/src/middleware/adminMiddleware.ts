import { NextFunction, Request, Response } from 'express'
import ApiError from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const adminRequired = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Access denied. Admin only')
    )
  }
  next()
}

export default adminRequired
