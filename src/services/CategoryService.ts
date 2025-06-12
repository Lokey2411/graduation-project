import { makeRequest } from './makeRequest';

export default {
	getCategories: async () => {
		const response = await makeRequest.get('/categories');
		return response.data;
	},
	getCategory: async (id: number) => {
		const response = await makeRequest.get(`/categories/${id}`);
		return response.data;
	},
	getProducts: async (id: number) => {
		const response = await makeRequest.get(`/categories/${id}/products`);
		return response.data;
	},
};
