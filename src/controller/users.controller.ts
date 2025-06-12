import { PRODUCT_ORDERS_STATUS, STATUS } from '@/constants'
import { createData } from '@/utils/controller/createData'
import { deleteData } from '@/utils/controller/deleteData'
import { getPaginationData } from '@/utils/controller/getAllData'
import { getDataById } from '@/utils/controller/getDataById'
import { updateData } from '@/utils/controller/updateData'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import connection from '@/config/db'
import { generateToken } from '@/utils/generateToken'

const TABLE_NAME = 'users'
const ERROR_MESSAGE = 'SQL Error:'

const SELECT_CART_BY_USER_ID_SQL = `
	SELECT 
		p_o.id as productOrderId,
		o.status as orderStatus,
		o.orderDate, 
		o.id as orderId,
		p_o.product_id, 
		p_o.variant_id, 
		p_o.quantity, 
		p_o.status, 
		v.price * p_o.quantity as orderPrice,
		v.name as variantName,
		p.*
		FROM orders o
		JOIN product_orders p_o
		JOIN products p
		JOIN variants v
		ON o.id = p_o.order_id
		AND v.id = p_o.variant_id
		AND p.id = p_o.product_id
		WHERE 
		o.userId = ? AND 
		o.isDelete = false AND
		p_o.isDelete = false AND
		v.isDelete = false AND
		p.isDelete = false AND
		p_o.status = ?
`

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const { status, data } = await getPaginationData(req, TABLE_NAME)
		if (status !== STATUS.OK) return res.status(status).json(data)
		else if (!Array.isArray(data)) throw new Error('Internal Server Error, data is not an array')
		return res.status(status).json(
			data.map(item => {
				delete item.PASSWORD
				return item
			}),
		)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getUserByToken = async (req: Request, res: Response) => {
	try {
		const { userId } = req.user
		const { status, data } = await getDataById(req, TABLE_NAME, userId)
		if (!(data instanceof Object)) throw new Error('Internal Server Error, data is not an object')
		if (!('PASSWORD' in data)) throw new Error('Internal Server Error, password is not in data')
		const { PASSWORD, ...category } = data
		return res.status(status).json(category)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { status, data } = await getDataById(req, TABLE_NAME, +id)
		if (!(data instanceof Object)) throw new Error('Internal Server Error, data is not an object')
		if (!('PASSWORD' in data)) throw new Error('Internal Server Error, password is not in data')
		const { PASSWORD, ...category } = data
		return res.status(status).json(category)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const createUser = async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			return res.status(STATUS.BAD_REQUEST).json('Request body is required')
		}

		const { username, fullName, email, password } = req.body
		if (!username || !fullName || !email || !password) {
			return res.status(STATUS.BAD_REQUEST).json('Missing required fields')
		}

		const data = { username, fullName, email, password: bcrypt.hashSync(password, 10) }
		const { status, message } = await createData(TABLE_NAME, data)
		const token = generateToken({ username, fullName, email })
		return res.status(status).json({ message, token })
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const deteleUser = async (req: Request, res: Response) => {
	try {
		const { status, message } = await deleteData(req, TABLE_NAME)
		return res.status(status).json(message)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const updateUser = async (req: Request, res: Response) => {
	try {
		const { userId } = req.user

		const { username, fullName, email } = req.body
		if (!username || !fullName || !email) {
			return res.status(STATUS.BAD_REQUEST).json('Missing required fields')
		}
		const data = { username, fullName, email }
		const { status, message } = await updateData(req, TABLE_NAME, data, userId)
		return res.status(status).json(message)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const updatePassword = async (req: Request, res: Response) => {
	try {
		const { currentPassword, password: newPassword, confirmPassword } = req.body
		if (!currentPassword || !newPassword) {
			return res.status(STATUS.BAD_REQUEST).json('Missing required fields')
		}
		if (newPassword !== confirmPassword) {
			return res.status(STATUS.BAD_REQUEST).json('Password and confirm password do not match')
		}
		const { userId } = req.user
		const { data: user, status: getUserStatus } = await getDataById(req, TABLE_NAME, userId)
		if (getUserStatus !== STATUS.OK) return res.status(getUserStatus).json(user)
		if (!(user instanceof Object)) throw new Error('Internal Server Error, data is not an object')
		if (!('PASSWORD' in user)) throw new Error('Internal Server Error, password is not in data')
		if (!bcrypt.compareSync(currentPassword, user.PASSWORD)) {
			return res.status(STATUS.UNAUTHORIZED).json('Invalid credentials')
		}

		const data = { password: bcrypt.hashSync(newPassword, 10) }
		const { status, message } = await updateData(req, TABLE_NAME, data, userId)
		return res.status(status).json(message)
	} catch (error) {
		console.error(ERROR_MESSAGE, error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getCartByUserId = async (req: Request, res: Response) => {
	try {
		const { userId: id } = req.user
		const sql = SELECT_CART_BY_USER_ID_SQL
		const values = [id, PRODUCT_ORDERS_STATUS.CART]
		const [cart] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(cart)
	} catch (error) {
		console.error('Error get cart by user id', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getWishlistByUserId = async (req: Request, res: Response) => {
	try {
		const { userId: id } = req.user
		const sql = SELECT_CART_BY_USER_ID_SQL
		const values = [id, PRODUCT_ORDERS_STATUS.FAVORITE]
		const [wishlist] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(wishlist)
	} catch (error) {
		console.error('Error get wishlist by user id', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const removeWishlist = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `UPDATE product_orders SET isDelete = true WHERE id = ?;`
		const values = [id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Error remove wishlist', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
