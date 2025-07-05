import {
	cancelOrder,
	cartProduct,
	checkoutCart,
	confirmOrder,
	getAllOrders,
	getAllOrderStatuses,
	getOrder,
	getProductsByOrderId,
	removeFromCart,
	updateOrderQuantity,
	updateOrderStatus,
} from '@/controller/users/orders.controller'
import { asyncHandler } from '@/middleware/asyncHandler'
import { requireAdmin, requireLogin } from '@/middleware/authMiddleware'
import { Router } from 'express'
const orderRouter = Router()

orderRouter.get('/', requireLogin, asyncHandler(getAllOrders))
orderRouter.post('/', requireLogin, asyncHandler(cartProduct))
orderRouter.get('/statuses', requireLogin, requireAdmin, getAllOrderStatuses)
orderRouter.get('/:id', requireLogin, asyncHandler(getOrder))
orderRouter.get('/:id/products', requireLogin, asyncHandler(getProductsByOrderId))
orderRouter.put('/:id', requireLogin, requireAdmin, asyncHandler(updateOrderStatus))
orderRouter.patch('/quantity/:id', requireLogin, asyncHandler(updateOrderQuantity))
orderRouter.patch('/:id', requireLogin, asyncHandler(confirmOrder))
orderRouter.patch('/:id/cancel', requireLogin, asyncHandler(cancelOrder))
orderRouter.patch('/:id/checkout', requireLogin, asyncHandler(checkoutCart))
orderRouter.delete('/:id', requireLogin, asyncHandler(removeFromCart))

export default orderRouter
