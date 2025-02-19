import jwt, { Secret } from 'jsonwebtoken'

export const generateAccessToken = (user: IUser): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET as Secret
  const expiresIn = process.env.ACCESS_TOKEN_LIFE || '1h'

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined')
  }

  return jwt.sign({ _id: user._id, email: user.email }, secret, { expiresIn })
}

export const verifyAccessToken = (
  token: string
): Pick<IUser, '_id' | 'email'> => {
  const secret = process.env.ACCESS_TOKEN_SECRET as Secret

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined')
  }

  return jwt.verify(token, secret) as Pick<IUser, '_id' | 'email'>
}
