import connection from '@/config/db'
import { MYSQL_LIMIT_RESULT_DEFAULT, STATUS } from '@/constants'
import { createData } from '@/utils/controller/createData'
import { deleteData } from '@/utils/controller/deleteData'
import { getPaginationData } from '@/utils/controller/getAllData'
import { getDataById } from '@/utils/controller/getDataById'
import { updateData } from '@/utils/controller/updateData'
import { Request, Response } from 'express'

const TABLE_NAME = 'categories'

export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const { status, data: categories } = await getPaginationData(req, TABLE_NAME)
		return res.status(status).json(categories)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getCategoryById = async (req: Request, res: Response) => {
	try {
		const { status, data: category } = await getDataById(req, TABLE_NAME)
		return res.status(status).json(category)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const createCategory = async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			return res.status(STATUS.BAD_REQUEST).json('Request body is required')
		}

		const { name, description, image_url, isNewArrival } = req.body
		if (!name || !description || !image_url) {
			return res.status(STATUS.BAD_REQUEST).json('Missing required fields')
		}

		const data = { name, description, image_url, isNewArrival }
		const { status, message } = await createData(TABLE_NAME, data)
		return res.status(status).json(message)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const deleteCategory = async (req: Request, res: Response) => {
	try {
		const { status, message } = await deleteData(req, TABLE_NAME)
		return res.status(status).json(message)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const updateCategory = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(STATUS.BAD_REQUEST).json('ID is required')
		}

		const { name, description, image_url, isNewArrival } = req.body
		if (!name || !description || !image_url) {
			return res.status(STATUS.BAD_REQUEST).json('Missing required fields')
		}

		const data = { name, description, image_url, isNewArrival }
		const { status, message } = await updateData(req, TABLE_NAME, data)
		return res.status(status).json(message)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getProductsByCategoryId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { page, pageSize } = req.query
		const offset = (Number(page) - 1) * Number(pageSize) || 0
		if (!id) {
			return res.status(STATUS.NOT_FOUND).json('ID is required')
		}
		const sql = `SELECT * FROM products WHERE category_id = ? AND isDelete=false LIMIT ? OFFSET ?`
		const asyncData = (await connection).query(sql, [id, pageSize || MYSQL_LIMIT_RESULT_DEFAULT, offset])
		const [products] = await asyncData
		return res.status(STATUS.OK).json(products)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
