export const getSelectByIdQuery = (table: string, id: number | string) => {
	const query = `SELECT * FROM ${table} WHERE id = ? AND isDelete = false`
	const values = [id]
	return { query, values }
}
