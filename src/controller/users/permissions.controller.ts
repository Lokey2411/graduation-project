import connection from '@/config/db'
import { STATUS } from '@/constants'
import { Request, Response } from 'express'

export const getUserPermissions = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `SELECT p.* FROM 
			permissions p
			JOIN user_has_permissions u_p
			JOIN users u
			ON u.id = u_p.user_id
			AND p.id = u_p.permission_id
			WHERE u.id = ?
			AND p.isDelete = false
			AND u.isDelete = false
			AND u_p.isDelete = false
			`
		const values = [id]
		const [permissions] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(permissions)
	} catch (error) {
		console.error('Get user permissions error', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getAllPermissions = async (req: Request, res: Response) => {
	try {
		const sql = `SELECT * FROM permissions WHERE isDelete = false`
		const [permissions] = await (await connection).query(sql)
		return res.status(STATUS.OK).json(permissions)
	} catch (error) {
		console.error('Get all permissions error', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const addUserPermission = async (req: Request, res: Response) => {
	try {
		const { id: user_id } = req.params
		const { permission_id } = req.body
		const sql = `INSERT INTO user_has_permissions (user_id, permission_id) VALUES (?, ?)`
		const values = [user_id, permission_id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Add user permission error', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const removeUserPermission = async (req: Request, res: Response) => {
	try {
		const { id: user_id } = req.params
		const { permission_id } = req.body
		const sql = `UPDATE user_has_permissions SET isDelete = true WHERE user_id = ? AND permission_id = ?`
		const values = [user_id, permission_id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Remove user permission error', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
