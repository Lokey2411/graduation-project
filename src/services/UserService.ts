import makeRequest from './makeRequest';

export default {
	getProfile: async () => {
		const response = await makeRequest.get('/users/profile');
		return response.data;
	},
	getAddresses: async () => {
		const response = await makeRequest.get('/users/addresses');
		return response.data;
	},
	addAddress: async (address: { address: string; isPrimaryAddress: boolean; userId: number }) => {
		const response = await makeRequest.post('/users/addresses', address);
		return response;
	},
	updateAddress: async (id: number, address: { address: string; isPrimaryAddress: boolean }) => {
		const response = await makeRequest.put(`/users/addresses/${id}`, address);
		return response;
	},
	getFavorite: async () => {
		const response = await makeRequest.get('/users/wishlist');
		return response.data;
	},
	getOrdres: async (search = '') => {
		const response = await makeRequest.get('/users/orders' + search);
		return response.data;
	},
	getCart: async () => {
		const response = await makeRequest.get('/users/cart');
		return response.data;
	},
};
