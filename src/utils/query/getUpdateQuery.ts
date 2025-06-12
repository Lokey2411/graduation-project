export const getUpdateQuery = (tableName: string, data: Record<string, any>, id: string | number) => {
	const columns = Object.keys(data)
		.map(key => `${key} = ?`)
		.join(', ')
	const query = `UPDATE ${tableName} SET ${columns} WHERE id = ? AND isDelete = false`
	const values = Object.values(data).concat(id)
	return { query, values }
}
