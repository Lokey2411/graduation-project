import { JWT_SECRET } from '@/config/env'
import jwt from 'jsonwebtoken'

export const refreshToken = async (token: string) => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
		if (!decoded) {
			throw new Error('Invalid or expired token')
		}
		const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '1d' })
		return newToken
	} catch (error) {
		console.error('Error verifying token:', error)
		return ''
	}
}
