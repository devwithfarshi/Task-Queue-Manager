export type IFile = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

declare global {
  namespace Express {
    type Request = {
      files?: IFile
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser
  }
}
