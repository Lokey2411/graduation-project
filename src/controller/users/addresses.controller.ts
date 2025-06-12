import connection from '@/config/db'
import { STATUS } from '@/constants'
import { Request, Response } from 'express'

const TABLE_NAME = 'addresses'
const ERROR_MESSAGE = 'SQL Error:'
const checkPrimaryAddress = async (userId: number) => {
	const sql = `SELECT * FROM ${TABLE_NAME} WHERE userId = ? AND isPrimaryAddress = true AND isDelete = false`
	const values = [userId]
	const [result] = await (await connection).query(sql, values)
	return result
}

export const getAllAddresses = async (req: Request, res: Response) => {
	try {
		const { userId } = req.user
		const sql = `SELECT * FROM ${TABLE_NAME} WHERE userId = ? AND isDelete = false ORDER BY isPrimaryAddress DESC`
		const values = [userId]
		const [addresses] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(addresses)
	} catch (error) {
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error' + error.message)
	}
}

export const addAddress = async (req: Request, res: Response) => {
	try {
		const { userId } = req.user
		const { address, isPrimaryAddress } = req.body
		// check if user has a primary address
		if (isPrimaryAddress) {
			const result = await checkPrimaryAddress(userId)
			if (Array.isArray(result) && result.length > 0) {
				return res.status(STATUS.BAD_REQUEST).json('User already has a primary address')
			}
		}
		const sql = `INSERT INTO ${TABLE_NAME} (userId, address, isPrimaryAddress) VALUES (?, ?,?);`
		const values = [userId, address, !!isPrimaryAddress]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error' + error.message)
	}
}

export const updateAddress = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { address, isPrimaryAddress } = req.body
		if (isPrimaryAddress) {
			const result = await checkPrimaryAddress(req.user.userId)
			if (Array.isArray(result) && result.length > 0) {
				// check if id is primary address
				if ('id' in result[0] && result[0].id !== +id) {
					return res.status(STATUS.BAD_REQUEST).json('Id is not primary address')
				}
			}
		}
		const sql = `UPDATE ${TABLE_NAME} SET address = ?, isPrimaryAddress = ? WHERE id = ?;`
		const values = [address, !!isPrimaryAddress, id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error' + error.message)
	}
}

export const deleteAddress = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `UPDATE ${TABLE_NAME} SET isDelete = true WHERE id = ?;`
		const values = [id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error' + error.message)
	}
}
