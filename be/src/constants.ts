import path from 'path'

export const PREFIX_PATH = '/services/api'
export const PORT = 8000
export const STATUS = {
	OK: 200,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503,
}

export const ORDER_STATUS = {
	PENDING: 'pending',
	PREPARING: 'preparing',
	SHIPPING: 'shipping',
	DELIVERED: 'delivered',
	CANCELED: 'canceled',
}

export const PRODUCT_ORDERS_STATUS = {
	CART: 'carting',
	FAVORITE: 'favorite',
	CHECKOUT: 'checkout',
}

export const MYSQL_LIMIT_RESULT_DEFAULT = 10
export const MYSQL_LIMIT_RESULT_MAX = 1000

export const ROOT_DIR = process.env.NODE_ENV === 'production' ? '/var/task' : path.join(__dirname, '../')
