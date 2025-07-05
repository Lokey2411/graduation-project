export const getInsertDataQuery = (table: string, data: Record<string, any>) => {
	const columns = Object.keys(data).join(', ')
	const placeholders = Object.keys(data)
		.map(() => '?')
		.join(', ')
	const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
	const values = Object.values(data)
	return { query, values }
}
