import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getCategoryById,
	getProductsByCategoryId,
	updateCategory,
} from '@/controller/categories.controller'
import { asyncHandler } from '@/middleware/asyncHandler'
import { requireAdmin, requireLogin } from '@/middleware/authMiddleware'
import express from 'express'
const categoryRouter = express.Router()

categoryRouter.get('/', asyncHandler(getAllCategories))
categoryRouter.get('/:id', asyncHandler(getCategoryById))
categoryRouter.post('/', requireLogin, requireAdmin, asyncHandler(createCategory))
categoryRouter.delete('/:id', requireLogin, requireAdmin, asyncHandler(deleteCategory))
categoryRouter.put('/:id', requireLogin, requireAdmin, asyncHandler(updateCategory))
categoryRouter.get('/:id/products', asyncHandler(getProductsByCategoryId))
export default categoryRouter
