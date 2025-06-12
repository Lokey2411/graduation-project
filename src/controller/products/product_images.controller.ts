import connection from '@/config/db'
import { STATUS } from '@/constants'
import { createData } from '@/utils/controller/createData'
import { deleteData } from '@/utils/controller/deleteData'
import { Request, Response } from 'express'

const getPrimaryImage = async (id: number) => {
	const query = `SELECT * FROM product_images WHERE product_id = ? AND isPrimaryImage = true AND isDelete = false LIMIT 1`
	const queryResult = (await connection).query(query, [id])
	const [result] = await queryResult
	return result
}

export const addProductImage = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		const { imageUrl, isPrimaryImage } = req.body
		if (!imageUrl) {
			return res.status(STATUS.BAD_REQUEST).json('Image is required')
		}
		// check if primary image is exist
		if (isPrimaryImage) {
			const primaryImage = await getPrimaryImage(+id)
			if (Array.isArray(primaryImage) && primaryImage.length > 0) {
				return res.status(STATUS.BAD_REQUEST).json('Product already has a primary image')
			}
		}
		const { status, message } = await createData('product_images', {
			product_id: id,
			imageUrl,
			isPrimaryImage: !!isPrimaryImage,
		})
		return res.status(status).json(message)
	} catch (error) {
		if (
			error.sqlMessage ===
			'Cannot add or update a child row: a foreign key constraint fails (`datn_db`.`product_images`, CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`))'
		) {
			return res.status(STATUS.NOT_FOUND).json('Product is not exist')
		}
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const removeProductImage = async (req: Request, res: Response) => {
	try {
		const { id, imageId } = req.params
		if (!id || !imageId) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		const { status, message } = await deleteData(req, 'product_images', +imageId)
		return res.status(status).json(message)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getProductImages = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		const sql =
			'SELECT * FROM product_images WHERE product_id = ? AND isDelete = false ORDER BY isPrimaryImage DESC LIMIT 5'
		const values = [id]
		const rowsQuery = (await connection).query(sql, values)
		const [rows] = await rowsQuery
		if ('length' in rows && rows.length > 0) {
			return res.status(STATUS.OK).json(rows)
		} else {
			return res.status(STATUS.NOT_FOUND).json('No images found for this product')
		}
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
