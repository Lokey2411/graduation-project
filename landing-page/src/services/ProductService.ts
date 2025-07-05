import { makeRequest } from './makeRequest';

const ProductService = {
	getProducts: async () => {
		const response = await makeRequest.get('/products');
		return await response.data;
	},
	getProductById: async (id: number) => {
		const response = await makeRequest.get(`/products/${id}`);
		return await response.data;
	},
	getProductCategory: async (id: number) => {
		const response = await makeRequest.get(`/products/${id}/category`);
		return await response.data;
	},
	getProductVariants: async (id: number) => {
		const response = await makeRequest.get(`/products/${id}/variants`);
		return await response.data;
	},
	getProductImages: async (id: number) => {
		const response = await makeRequest.get(`/products/${id}/images`);
		const data = await response.data;
		if (!Array.isArray(data)) return [];
		return data.map((item: any) => item.imageUrl);
	},
	getRelatedProducts: async (id: number) => {
		const response = await makeRequest.get(`/products/${id}/related-products`);
		return await response.data;
	},
};

export default ProductService;
