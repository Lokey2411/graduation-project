import { Request } from 'express'
import { getSelectAllQuery } from '../query/getSelectAllQuery'
import connection from '@/config/db'
import { MYSQL_LIMIT_RESULT_DEFAULT, MYSQL_LIMIT_RESULT_MAX, STATUS } from '@/constants'
import { getFilteredString } from './getFilteredString'

export const getPaginationData = async (req: Request, tableName: string) => {
	try {
		const limit = req.query.pageSize || MYSQL_LIMIT_RESULT_DEFAULT
		const orderBy = (req.query.orderBy as string) || 'id'
		const order = (req.query.order as string) || 'ASC'
		const offset = req.query.page ? (+req.query.page - 1) * +limit : 0
		// get filtered via url
		const filteredString = getFilteredString(req)
		const queryData = (await connection).query(
			getSelectAllQuery(tableName, {
				limit: +limit,
				offset: +offset,
				sortBy: String(orderBy),
				sortOrder: String(order),
			}),
			filteredString,
		)
		const [data] = await queryData
		return { status: STATUS.OK, data }
	} catch (error) {
		console.error('Error fetching categories:', error)
		return { status: STATUS.INTERNAL_SERVER_ERROR, data: 'Internal Server Error' }
	}
}
export const getAllData = async (req: Request, tableName: string) => {
	try {
		const queryData = (await connection).query(getSelectAllQuery(tableName, { limit: MYSQL_LIMIT_RESULT_MAX }))
		const [data] = await queryData
		return { status: STATUS.OK, data }
	} catch (error) {
		console.error('Error fetching categories:', error)
		return { status: STATUS.INTERNAL_SERVER_ERROR, data: 'Internal Server Error' }
	}
}
