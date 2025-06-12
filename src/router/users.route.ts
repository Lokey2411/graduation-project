import {
	createUser,
	getAllUsers,
	getUserByToken,
	updateUser,
	deteleUser,
	getWishlistByUserId,
	getCartByUserId,
	removeWishlist,
	updatePassword,
	getUserById,
} from '@/controller/users.controller'
import { addAddress, deleteAddress, getAllAddresses, updateAddress } from '@/controller/users/addresses.controller'
import { getUserOrders } from '@/controller/users/orders.controller'
import { addUserPermission, getUserPermissions, removeUserPermission } from '@/controller/users/permissions.controller'
import { asyncHandler } from '@/middleware/asyncHandler'
import { requireAdmin, requireLogin } from '@/middleware/authMiddleware'

const express = require('express')
const userRouter = express.Router()

userRouter.get('/', requireLogin, requireAdmin, asyncHandler(getAllUsers))
userRouter.post('/', requireLogin, requireAdmin, asyncHandler(createUser))
userRouter.get('/wishlist', requireLogin, asyncHandler(getWishlistByUserId))
userRouter.get('/orders', requireLogin, asyncHandler(getUserOrders))
userRouter.delete('/wishlist/:id', requireLogin, asyncHandler(removeWishlist))
userRouter.get('/cart', requireLogin, asyncHandler(getCartByUserId))
userRouter.put('/profile', requireLogin, asyncHandler(updateUser))
userRouter.get('/profile', requireLogin, asyncHandler(getUserByToken))
userRouter.get('/addresses', requireLogin, asyncHandler(getAllAddresses))

userRouter.get('/:id', requireLogin, requireAdmin, asyncHandler(getUserById))
userRouter.patch('/change-password', requireLogin, asyncHandler(updatePassword))
userRouter.delete('/:id', requireLogin, requireAdmin, asyncHandler(deteleUser))
// permissions
userRouter.get('/:id/permissions', requireLogin, requireAdmin, asyncHandler(getUserPermissions))
userRouter.post('/:id/permissions', requireLogin, requireAdmin, asyncHandler(addUserPermission))
userRouter.delete('/:id/permissions', requireLogin, requireAdmin, asyncHandler(removeUserPermission))
// address
userRouter.post('/addresses', requireLogin, asyncHandler(addAddress))
userRouter.put('/addresses/:id', requireLogin, asyncHandler(updateAddress))
userRouter.delete('/addresses/:id', requireLogin, asyncHandler(deleteAddress))
export default userRouter
