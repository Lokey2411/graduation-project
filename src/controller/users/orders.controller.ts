import connection from '@/config/db'
import { ORDER_STATUS, PRODUCT_ORDERS_STATUS, STATUS } from '@/constants'
import { getFilteredString } from '@/utils/controller/getFilteredString'
import axios from 'axios'
import { Request, Response } from 'express'

const checkForeign = async (productId: number, variantId: number) => {
	const productSql = `SELECT * FROM products WHERE id = ? AND isDelete = false LIMIT 1`
	const productValues = [productId]
	const variantSql = `SELECT * FROM variants WHERE id = ? AND isDelete = false LIMIT 1`
	const variantValues = [variantId]
	const [[products], [variants]] = await Promise.all([
		(await connection).query(productSql, productValues),
		(await connection).query(variantSql, variantValues),
	])
	const isArray = (variable: any): variable is any[] => Array.isArray(variable) && variable.length > 0
	const isValidForeign = isArray(products) && isArray(variants)
	return isValidForeign
}

const getDataExist = async (userId: number) => {
	const sql = `SELECT orders.* 
	FROM orders 
	JOIN product_orders 
	ON orders.id = product_orders.order_id 
	WHERE userId = ? AND 
	orders.isDelete = false AND 
	product_orders.isDelete = false AND
	product_orders.status = '${PRODUCT_ORDERS_STATUS.CART}'
	`
	const values = [userId]
	const [result] = await (await connection).query(sql, values)
	return result
}

const getProductInCart = async (orderId: number, variantId: number) => {
	const sql = `SELECT * FROM product_orders WHERE order_id = ? AND variant_id = ? AND isDelete = false`
	const values = [orderId, variantId]
	const [result] = await (await connection).query(sql, values)
	return result
}

export const getUserOrders = async (req: Request, res: Response) => {
	try {
		const { userId: id } = req.user
		const filterString = getFilteredString(req)
		const sql = `SELECT * FROM orders WHERE userId = ? AND isDelete = false AND ${filterString}`
		const values = [id]
		const [orders] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(orders)
	} catch (error) {
		console.error('Error get user orders', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

const validateCartProductInput = (body: any) => {
	const { price, quantity, product_id, variant_id, status } = body
	if (!price || !quantity || !product_id || !variant_id || !status) {
		return 'Price, quantity, product_id, variant_id and status are required'
	}
	if (!Object.values(PRODUCT_ORDERS_STATUS).includes(status)) {
		return 'Status invalid'
	}
	return null
}

const getOrCreateOrderId = async (userId: number, price: number) => {
	const existData = await getDataExist(userId)
	let orderId = 0
	if (!Array.isArray(existData) || existData.length === 0) {
		const sql = `INSERT INTO orders (userId, orderDate, price, status, address) VALUES (?, ?, ?, ?, '')`
		const values = [userId, new Date(), price, ORDER_STATUS.PENDING]
		let [result] = await (await connection).query(sql, values)
		if (!('insertId' in result)) {
			throw new Error('Internal Server Error')
		}
		orderId = result.insertId
	} else if ('id' in existData[0] && existData[0].id) {
		orderId = existData[0].id
	}
	return orderId
}

const updateOrInsertProductInCart = async (
	orderId: number,
	product_id: number,
	variant_id: number,
	quantity: number,
	status: string,
	reqQuantity: number,
	res: Response,
) => {
	const productInCart = await getProductInCart(orderId, variant_id)
	if (Array.isArray(productInCart) && productInCart.length > 0 && 'quantity' in productInCart[0]) {
		const { quantity: existingQuantity } = productInCart[0]
		const sql = `UPDATE product_orders SET quantity = ? WHERE order_id = ? AND product_id = ? AND variant_id = ?`
		const values = [existingQuantity + reqQuantity, orderId, product_id, variant_id]
		const [result] = await (await connection).query(sql, values)
		if ('affectedRows' in result && result.affectedRows === 0) {
			console.log('add to product cart failed')
			return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
		}
	} else {
		const orderDetailSql = `INSERT INTO product_orders (order_id, product_id, variant_id, quantity, status) VALUES (?, ?, ?, ?,?)`
		const orderDetailValues = [orderId, product_id, variant_id, quantity, status]
		const [orderDetailResult] = await (await connection).query(orderDetailSql, orderDetailValues)
		if ('affectedRows' in orderDetailResult && orderDetailResult.affectedRows === 0) {
			console.log('add to product cart failed')
			return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
		}
	}
	return null
}

export const cartProduct = async (req: Request, res: Response) => {
	try {
		const { userId } = req.user
		const { price, quantity, product_id, variant_id, status } = req.body

		const inputError = validateCartProductInput(req.body)
		if (inputError) {
			return res.status(STATUS.BAD_REQUEST).json(inputError)
		}

		const [isValidData, orderId] = await Promise.all([
			checkForeign(product_id, variant_id),
			getOrCreateOrderId(userId, price),
		])

		if (!isValidData) {
			return res.status(STATUS.NOT_FOUND).json('Product or variant is not exist')
		}
		const updateOrInsertError = await updateOrInsertProductInCart(
			orderId,
			product_id,
			variant_id,
			quantity,
			status,
			req.body.quantity,
			res,
		)
		if (updateOrInsertError) return updateOrInsertError

		return res.status(STATUS.OK).json('Add to cart successfully')
	} catch (error) {
		console.error('Error add to cart', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const removeFromCart = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { product_id } = req.body
		const sql = `DELETE FROM product_orders WHERE order_id = ? AND product_id = ?`
		const values = [+id, product_id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Error remove from cart', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const updateOrderQuantity = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { quantity, price, productOrderId } = req.body
		const [productResult, orderResult] = await Promise.all([
			(await connection).query(`UPDATE product_orders SET quantity = ? WHERE  id = ?`, [quantity, productOrderId]),
			(await connection).query(`UPDATE orders SET price = ? WHERE id = ?`, [price, id]),
		])
		const [productUpdate, orderUpdate] = [productResult[0], orderResult[0]]
		const affectedRows =
			('affectedRows' in productUpdate ? productUpdate.affectedRows : 0) +
			('affectedRows' in orderUpdate ? orderUpdate.affectedRows : 0)
		return res.status(STATUS.OK).json({ affectedRows })
	} catch (error) {
		console.error('Error update order quantity', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const updateOrderStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { status } = req.body
		const sql = `UPDATE orders SET status = ? WHERE id = ?`
		const values = [status, id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Error update order status', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const checkoutCart = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const status = PRODUCT_ORDERS_STATUS.CHECKOUT
		const { price, address } = req.body
		const [productResult, orderResult] = await Promise.all([
			(await connection).query(`UPDATE product_orders SET status = ? WHERE order_id = ?`, [status, id]),
			(
				await connection
			).query(`UPDATE orders SET price = ?, orderDate = ?, address = ? WHERE id = ?`, [price, new Date(), address, id]),
		])
		const [result, updateOrderResult] = [productResult[0], orderResult[0]]
		return res.status(STATUS.OK).json({ result, updateOrderResult })
	} catch (error) {
		console.error('Error checkout cart', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getAllOrderStatuses = (req: Request, res: Response) => {
	res.status(STATUS.OK).json(Object.values(ORDER_STATUS).map(status => ({ status })))
}

export const getAllOrders = async (req: Request, res: Response) => {
	try {
		const sql = `SELECT * FROM orders WHERE isDelete = false`
		const [result] = await (await connection).query(sql)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Error get all orders', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const cancelOrder = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `UPDATE orders SET isDelete = true WHERE id = ?`
		const values = [id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Error cancel order', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const confirmOrder = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `UPDATE orders SET status = ? WHERE id = ?`
		const values = [ORDER_STATUS.DELIVERED, id]
		const [result] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Error confirm order', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getOrder = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `SELECT * FROM orders WHERE id = ? AND isDelete = false`
		const values = [id]
		const [result] = await (await connection).query(sql, values)
		if (!result) return res.status(STATUS.NOT_FOUND).json('Order not found')
		return res.status(STATUS.OK).json(result[0])
	} catch (error) {
		console.error('Error get order', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getProductsByOrderId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `
			SELECT 
			p.id,
			p.name,
			p.priceAfterDiscount,
			po.quantity,
			o.price,
			po.variant_id,
			po.status as userStatus,
			v.name as variant
			FROM product_orders po
			JOIN products p
			JOIN orders o
			JOIN variants v
			ON po.order_id = o.id
			AND po.product_id = p.id
			AND po.variant_id = v.id
			WHERE o.id = ?
			AND po.isDelete = false
			AND o.isDelete = false
			AND p.isDelete = false
			AND po.status = '${PRODUCT_ORDERS_STATUS.CHECKOUT}'			
		`
		const values = [id]
		const [result] = await (await connection).query(sql, values)
		if (!Array.isArray(result) || result.length === 0) {
			return res.status(STATUS.NOT_FOUND).json('No products found for this order')
		}
		const images = await Promise.all(
			result.map(({ id }: any) => {
				const response = axios.get('http://localhost:8000/services/api/products/' + id + '/images')
				return response.then(res => res.data[0].imageUrl)
			}),
		)
		result.forEach((item: any, index: number) => {
			item.image = images[index]
		})
		return res.status(STATUS.OK).json(result)
	} catch (error) {
		console.error('Error get products by order id', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
