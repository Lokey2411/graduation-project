import { makeRequest } from './makeRequest';

export const refreshToken = async () => {
	let token = '';
	makeRequest
		.post('/refresh-token', {})
		.then(res => {
			if (res.status === 200) {
				token = res.data.token;
				if (!token) throw new Error('Failed to refresh token');
				localStorage.setItem('token', token);
			} else {
				throw new Error('Failed to refresh token' + res.status);
			}
		})
		.catch(console.error);
	return token;
};
