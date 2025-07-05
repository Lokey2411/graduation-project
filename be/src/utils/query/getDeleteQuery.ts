export const getDeleteQuery = (table: string, id: number | string) => {
	const query = `UPDATE ${table} SET isDelete = true WHERE id = ?`
	const values = [id]
	return { query, values }
}
