import { STATUS } from '@/constants'
import { Request, Response } from 'express'
import connection from '@/config/db'

export const addVariant = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		const { name, price, variantType } = req.body
		if (!name || !price || !variantType) {
			return res.status(STATUS.BAD_REQUEST).json('Name, price and variantType are required')
		}
		const sql = 'INSERT INTO variants (product_id, name, price, variantType) VALUES (?, ?, ?,?)'
		const values = [id, name, price, variantType]
		const result = await (await connection).query(sql, values)

		if ('affectedRows' in result[0] && result[0].affectedRows > 0) {
			return res.status(STATUS.OK).json('Variant added successfully')
		} else {
			return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Failed to add variant')
		}
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getProductVariants = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}

		const sql = 'SELECT * FROM variants WHERE product_id = ? AND isDelete = false'
		const values = [id]
		const result = await (await connection).query(sql, values)

		return res.status(STATUS.OK).json(result[0])
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const removeVariant = async (req: Request, res: Response) => {
	try {
		const { id, variant_id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		if (!variant_id) {
			return res.status(STATUS.BAD_REQUEST).json('Variant ID is required')
		}
		const sql = 'UPDATE variants SET isDelete = true WHERE product_id = ? AND id = ?'
		const values = [id, variant_id]
		const result = await (await connection).query(sql, values)

		if ('affectedRows' in result[0] && result[0].affectedRows > 0) {
			return res.status(STATUS.OK).json('Variant removed successfully')
		}
		return res.status(STATUS.NOT_FOUND).json('Variant not found')
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const updateVariant = async (req: Request, res: Response) => {
	try {
		const { variant_id: id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}

		const { name, price, variantType } = req.body
		if (!name || !price || !variantType) {
			return res.status(STATUS.BAD_REQUEST).json('Name, value and variantType are required')
		}

		const sql = 'UPDATE variants SET name = ?, price = ?, variantType = ? WHERE id = ?'
		const values = [name, price, variantType, id]
		const result = await (await connection).query(sql, values)

		if ('affectedRows' in result[0] && result[0].affectedRows > 0) {
			return res.status(STATUS.OK).json('Variant updated successfully')
		}
		return res.status(STATUS.NOT_FOUND).json('Variant not found')
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getVariantById = async (req: Request, res: Response) => {
	try {
		const { variant_id } = req.params
		if (!variant_id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		const sql = 'SELECT * FROM variants WHERE id = ? AND isDelete = false'
		const values = [variant_id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result[0])
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
