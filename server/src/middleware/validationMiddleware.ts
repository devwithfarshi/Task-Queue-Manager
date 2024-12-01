/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid data',
          errors: errorMessage
        })
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Internal server error'
        })
      }
    }
  }
}
