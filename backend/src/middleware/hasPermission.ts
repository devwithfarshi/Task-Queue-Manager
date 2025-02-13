import { Request, Response, NextFunction } from 'express'
import ApiError from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { T_USER_ROLE } from '../config/constant'

const hasPermission =
  (allowedRoles: Partial<T_USER_ROLE[]> = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user?._id?.toString() !== req.params.userId) {
      if (!allowedRoles.includes(req.user?.role)) {
        return next(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Access denied. You are not allowed to perform this action'
          )
        )
      }
    }

    next()
  }

export default hasPermission
