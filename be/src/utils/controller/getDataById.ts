import { Request } from 'express'
import connection from '@/config/db'
import { STATUS } from '@/constants'
import { getSelectByIdQuery } from '../query/getSelectByIdQuery'

export const getDataById = async (req: Request, tableName: string, _id = 0) => {
	try {
		const { id } = req.params
		const { query, values } = getSelectByIdQuery(tableName, _id || id)
		const queryData = (await connection).query(query, values)
		const [data] = await queryData
		if (!data || !('length' in data) || data.length === 0) {
			return { status: STATUS.NOT_FOUND, data: 'Data not found' }
		}
		return { status: STATUS.OK, data: data[0] }
	} catch (error) {
		console.error('Error fetching categories:', error)
		return { status: STATUS.INTERNAL_SERVER_ERROR, data: 'Internal Server Error' }
	}
}
