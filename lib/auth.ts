import jwt from 'jsonwebtoken'

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
    userId: string
    email: string
    role: string
  }
}
