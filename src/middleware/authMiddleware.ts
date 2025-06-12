import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { STATUS } from '@/constants'
import { JWT_SECRET } from '@/config/env'
import connection from '@/config/db'

interface JwtPayload {
	userId: number
	username: string
}

// Thêm user vào Request type của Express
declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload
		}
	}
}

export const requireLogin = (req: Request, res: Response, next: NextFunction) => {
	// Lấy token từ header Authorization
	const authHeader = req.headers.authorization
	if (!authHeader?.startsWith('Bearer ')) {
		res.status(STATUS.UNAUTHORIZED).json({ error: 'Authorization header missing or invalid' })
		return
	}

	const token = authHeader.split(' ')[1] // Lấy token sau "Bearer"

	try {
		// Xác minh token
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
		if (!decoded) {
			res.status(STATUS.UNAUTHORIZED).json({ error: 'Invalid or expired token' })
			return
		}
		req.user = { userId: decoded.userId, username: decoded.username }
		next()
	} catch (error) {
		console.error('Error verifying token:', error)
		res.status(STATUS.BAD_REQUEST).json({ error: 'Invalid or expired token' })
		return
	}
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		res.status(STATUS.UNAUTHORIZED).json({ error: 'Unauthorized' })
		return
	}
	try {
		const { userId: id } = req.user
		const selectPermissionSql = 'SELECT * FROM user_has_permissions WHERE user_id = ? AND permission_id = 1'
		const values = [id]
		const [result] = await (await connection).query(selectPermissionSql, values)
		if (!(Array.isArray(result) && result.length > 0)) {
			res.status(STATUS.FORBIDDEN).json({ error: "You doesn't have permission with this action" })
			return
		}
		next()
	} catch (error) {
		console.error('Error verifying token:', error)
		res.status(STATUS.BAD_REQUEST).json({ error: 'Invalid or expired token' })
		return
	}
}
