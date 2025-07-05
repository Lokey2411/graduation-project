import connection from '@/config/db'
import { STATUS } from '@/constants'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { generateToken } from '@/utils/generateToken'
export const signIn = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body
		if (!username || !password) {
			return res.status(STATUS.BAD_REQUEST).json('Missing required fields')
		}

		const sql = `SELECT * FROM users WHERE username = ? OR email = ? AND isDelete = false LIMIT 1`
		const values = [username, username]
		const [users] = await (await connection).query(sql, values)
		if (!Array.isArray(users) || users.length === 0 || !('PASSWORD' in users[0])) {
			return res.status(STATUS.NOT_FOUND).json('User not found')
		}

		const user = users[0]
		if (!bcrypt.compareSync(password, user.PASSWORD)) {
			return res.status(STATUS.UNAUTHORIZED).json('Invalid credentials')
		}

		const token = generateToken(user)
		;(req as any).user = user
		return res.status(STATUS.OK).json({ token })
	} catch (error) {
		console.error('Server error when sign in,', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
