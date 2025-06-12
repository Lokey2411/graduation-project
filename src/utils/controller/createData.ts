import connection from '@/config/db'
import { getInsertDataQuery } from '../query/getInsertDataQuery'
import { STATUS } from '@/constants'

export const createData = async (tableName: string, data: Record<string, any>) => {
	try {
		const { query, values } = getInsertDataQuery(tableName, data) // Sử dụng hàm có sẵn
		const queryResult = (await connection).query(query, values)
		const result = await queryResult

		if ('affectedRows' in result[0] && result[0].affectedRows === 0) {
			return {
				status: STATUS.BAD_REQUEST,
				message: `Failed to create ${tableName}`,
			}
		}

		return {
			status: STATUS.OK,
			message: `Create ${tableName} successfully`,
		}
	} catch (error) {
		console.error('Error inserting data:', error)
		throw error
	}
}
