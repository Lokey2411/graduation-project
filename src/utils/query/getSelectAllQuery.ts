import { MYSQL_LIMIT_RESULT_DEFAULT } from '@/constants'

export const getSelectAllQuery = (
	tableName: string,
	{ limit = MYSQL_LIMIT_RESULT_DEFAULT, offset = 0, sortBy = 'id', sortOrder = 'ASC' },
	filteredString = '1=1',
) => {
	return `SELECT * FROM ${tableName} WHERE isDelete = false AND ${filteredString} ORDER BY ${sortBy} ${sortOrder}`
}
