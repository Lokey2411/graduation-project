import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getCategory,
	getProductById,
	updateProduct,
} from '@/controller/products/products.controller'
import * as productImageController from '@/controller/products/product_images.controller'
import * as relatedProductController from '@/controller/products/related_products.controller'
import * as productVariantController from '@/controller/products/variants.controller'
import { asyncHandler } from '@/middleware/asyncHandler'
import { Router } from 'express'
import { requireAdmin, requireLogin } from '@/middleware/authMiddleware'
const { addProductImage, getProductImages, removeProductImage } = productImageController
const { addRelate, getRelatedProducts, removeRelatedProduct, updateRelatedProduct } = relatedProductController
const { addVariant, getProductVariants, removeVariant, updateVariant } = productVariantController
const productRouter = Router()
productRouter.get('/', asyncHandler(getAllProducts))
productRouter.get('/:id', asyncHandler(getProductById))
productRouter.post('/', requireLogin, requireAdmin, asyncHandler(createProduct))
productRouter.put('/:id', requireLogin, requireAdmin, asyncHandler(updateProduct))
productRouter.delete('/:id', requireLogin, requireAdmin, asyncHandler(deleteProduct))

productRouter.get('/:id/category', asyncHandler(getCategory))
// images
productRouter.get('/:id/images', asyncHandler(getProductImages))
productRouter.post('/:id/images', requireLogin, requireAdmin, asyncHandler(addProductImage))
productRouter.delete('/:id/images/:imageId', requireLogin, requireAdmin, asyncHandler(removeProductImage))
// related prodducts
productRouter.get('/:id/related-products', asyncHandler(getRelatedProducts))
productRouter.post('/:id/related-products', requireLogin, requireAdmin, asyncHandler(addRelate))
productRouter.delete(
	'/:id/related-products/:related_product_id',
	requireLogin,
	requireAdmin,
	asyncHandler(removeRelatedProduct),
)
productRouter.put(
	'/:id/related-products/:related_product_id',
	requireLogin,
	requireAdmin,
	asyncHandler(updateRelatedProduct),
)
// variants
productRouter.get('/:id/variants', asyncHandler(getProductVariants))
productRouter.post('/:id/variants', requireLogin, requireAdmin, asyncHandler(addVariant))
productRouter.delete('/:id/variants/:variant_id', requireLogin, requireAdmin, asyncHandler(removeVariant))
productRouter.put('/:id/variants/:variant_id', requireLogin, requireAdmin, asyncHandler(updateVariant))
productRouter.get('/:id/variants/:variant_id', asyncHandler(productVariantController.getVariantById))
export default productRouter
