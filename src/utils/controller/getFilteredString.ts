import { Request } from 'express'

export const getFilteredString = (req: Request) => {
	const { pageSize, orderBy: orderBy_, order: order_, page, ...filter } = req.query
	const filteredString =
		Object.keys(filter).length > 0
			? '1=1 AND ' +
			  Object.keys(filter)
					.map(key => {
						const value = filter[key]
						let stringValue: string
						if (typeof value === 'object') {
							stringValue = JSON.stringify(value)
						} else {
							stringValue = String(value)
						}
						return `${key} = '${stringValue}'`
					})
					.join(' AND ')
			: '1=1'
	return filteredString
}
