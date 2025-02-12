import jwt from 'jsonwebtoken'

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_LIFE!
    }
  )
}

export const verifyAccessToken = (
  token: string
): Pick<IUser, '_id' | 'email'> => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as Pick<
    IUser,
    '_id' | 'email'
  >
}
