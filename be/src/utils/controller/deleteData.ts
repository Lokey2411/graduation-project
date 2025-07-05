import { STATUS } from '@/constants'
import { Request } from 'express'
import { getDeleteQuery } from '../query/getDeleteQuery'
import connection from '@/config/db'

export const deleteData = async (req: Request, tableName: string, _id = 0) => {
	try {
		const { id } = req.params
		if (!(id || _id)) {
			return {
				status: STATUS.NOT_FOUND,
				message: 'ID is required',
			}
		}
		const { query, values } = getDeleteQuery(tableName, _id || id)
		const queryResult = (await connection).query(query, values)
		const result = await queryResult
		if ('affectedRows' in result[0] && result[0].affectedRows === 0) {
			return {
				status: STATUS.BAD_REQUEST,
				message: `Failed to delete ${tableName}`,
			}
		}
		return {
			status: STATUS.OK,
			message: `Delete ${tableName} successfully`,
		}
	} catch (error) {
		console.error('Error deleting data:', error)
		throw error
	}
}
