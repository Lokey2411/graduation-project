import connection from '@/config/db'
import { STATUS } from '@/constants'
import { getUpdateQuery } from '../query/getUpdateQuery'
import { Request } from 'express'

export const updateData = async (req: Request, tableName: string, data: Record<string, any>, _id = 0) => {
	try {
		const { id } = req.params
		const { query, values } = getUpdateQuery(tableName, data, _id || id)
		const queryResult = (await connection).query(query, values)
		const result = await queryResult

		if ('affectedRows' in result[0] && result[0].affectedRows === 0) {
			return {
				status: STATUS.BAD_REQUEST,
				message: `Failed to update ${tableName}`,
			}
		}

		return {
			status: STATUS.OK,
			message: `Update ${tableName} successfully`,
		}
	} catch (error) {
		console.error('Error updating data:', error)
		throw error
	}
}
