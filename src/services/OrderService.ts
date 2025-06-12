import makeRequest from './makeRequest';

export default {
	addToCart: async (form: {
		price: number;
		quantity: number;
		product_id: number;
		variant_id: number;
		status: 'carting' | 'favorite';
	}) => {
		const response = await makeRequest.post('/orders', form);
		return response;
	},
	removeFromCart: async ({ id, product_id }: { id: number; product_id: number }) => {
		const response = await makeRequest.delete(`/orders/${id}`, { data: { product_id } });
		return response;
	},
	getCart: async () => {
		const response = await makeRequest.get('/users/cart');
		return await response.data;
	},
};
