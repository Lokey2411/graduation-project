import connection from '@/config/db'
import { MYSQL_LIMIT_RESULT_DEFAULT, STATUS } from '@/constants'
import { createData } from '@/utils/controller/createData'
import { Request, Response } from 'express'

export const getRelatedProducts = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const pageSize = +req.query.pageSize || MYSQL_LIMIT_RESULT_DEFAULT
		const page = +req.query.page || 1
		const offset = (page - 1) * pageSize
		if (!id) {
			return res.status(STATUS.BAD_REQUEST).json('ID is required')
		}
		const sql = `SELECT DISTINCT 
		p2.*,
		r_p.priority,
		r_p.related_product_id
		FROM products p1 
		JOIN products p2 
		JOIN related_products r_p 
		ON p1.id = r_p.product_id 
		AND p2.id = r_p.related_product_id 
		WHERE p1.id = ?  AND
		p2.isDelete = false AND
		r_p.isDelete = false AND
		p1.isDelete = false
		ORDER BY r_p.priority DESC
		LIMIT ? 
		OFFSET ?
		`
		const values = [id, pageSize, offset]
		const rowsQuery = (await connection).query(sql, values)
		const [rows] = await rowsQuery
		return res.status(STATUS.OK).json(rows)
	} catch (error) {
		console.error('Error fetching products:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const addRelate = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		const { related_product_id } = req.body
		const priority = req.body.priority ?? -1
		if (!related_product_id) {
			return res.status(STATUS.BAD_REQUEST).json('Related product ID is required')
		}
		const { status, message } = await createData('related_products', {
			product_id: id,
			related_product_id,
			priority,
		})
		return res.status(status).json(message)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const removeRelatedProduct = async (req: Request, res: Response) => {
	try {
		const { id, related_product_id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		if (!related_product_id) {
			return res.status(STATUS.BAD_REQUEST).json('Related product ID is required')
		}
		const sql = 'UPDATE related_products SET isDelete = true WHERE product_id = ? AND id = ?'
		const values = [id, related_product_id]
		const result = await (await connection).query(sql, values)

		if ('affectedRows' in result[0] && result[0].affectedRows > 0) {
			return res.status(STATUS.OK).json('Related product removed successfully')
		}
		return res.status(STATUS.NOT_FOUND).json('Related product not found')
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const updateRelatedProduct = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		const { related_product_id, priority } = req.body
		if (!related_product_id) {
			return res.status(STATUS.BAD_REQUEST).json('Related product ID is required')
		}
		const sql = 'UPDATE related_products SET priority = ? WHERE product_id = ? AND related_product_id = ?'
		const values = [priority, id, related_product_id]
		const result = await (await connection).query(sql, values)

		if ('affectedRows' in result[0] && result[0].affectedRows > 0) {
			return res.status(STATUS.OK).json('Related product updated successfully')
		}
		return res.status(STATUS.NOT_FOUND).json('Related product not found')
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
