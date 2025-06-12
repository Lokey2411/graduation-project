import connection from '@/config/db'
import { STATUS } from '@/constants'
import { createData } from '@/utils/controller/createData'
import { deleteData } from '@/utils/controller/deleteData'
import { getAllData, getPaginationData } from '@/utils/controller/getAllData'
import { getDataById } from '@/utils/controller/getDataById'
import { updateData } from '@/utils/controller/updateData'
import { Request, Response } from 'express'

const TABLE_NAME = 'products'
const ERROR_MESSAGE = 'SQL Error:'
const checkForeignData = async (req: Request, queryData: { category_id: number }) => {
	const { data: categories } = await getAllData(req, 'categories')
	const categoryIsExist =
		Array.isArray(categories) && categories.some((category: any) => category.id === +queryData.category_id)
	const isValidForeignData = categoryIsExist
	return isValidForeignData
}

export const getAllProducts = async (req: Request, res: Response) => {
	try {
		const { status, data } = await getPaginationData(req, TABLE_NAME)
		return res.status(status).json(data)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getProductById = async (req: Request, res: Response) => {
	try {
		const { status, data: category } = await getDataById(req, TABLE_NAME)
		return res.status(status).json(category)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const createProduct = async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			return res.status(STATUS.BAD_REQUEST).json('Request body is required')
		}

		const { name, description, price, discount, priceAfterDiscount, category_id, isBestSale } = req.body
		if (!name || !description || !price || !category_id) {
			return res.status(STATUS.BAD_REQUEST).json('Missing required fields')
		}
		const isValidForeignData = await checkForeignData(req, { category_id })
		if (!isValidForeignData) {
			return res.status(STATUS.NOT_FOUND).json('Category is not exist')
		}
		const data = { name, description, price, discount, priceAfterDiscount, category_id, isBestSale }
		const { status, message } = await createData(TABLE_NAME, data)
		return res.status(status).json(message)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { status, message } = await deleteData(req, TABLE_NAME)
		return res.status(status).json(message)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(STATUS.BAD_REQUEST).json('ID is required')
		}

		const { name, description, price, discount, priceAfterDiscount, category_id, isBestSale } = req.body
		if (!name || !description || !price || !category_id) {
			return res.status(STATUS.BAD_REQUEST).json('Missing required fields')
		}
		const isValidForeignData = await checkForeignData(req, { category_id })
		if (!isValidForeignData) {
			return res.status(STATUS.NOT_FOUND).json('Category is not exist')
		}
		const data = { name, description, price, discount, priceAfterDiscount, category_id, isBestSale }
		const { status, message } = await updateData(req, TABLE_NAME, data)
		return res.status(status).json(message)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getCategory = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `SELECT * FROM categories WHERE id = ? AND isDelete = false LIMIT 1`
		const values = [id]
		const [categories] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(categories[0])
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
