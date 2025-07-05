import { JWT_SECRET } from '@/config/env'
import jwt from 'jsonwebtoken'
export const generateToken = (user: any) => {
	const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' })
	return token
}
