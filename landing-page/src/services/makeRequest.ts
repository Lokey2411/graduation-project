import { getToken } from '@/commons/getToken';
import axios from 'axios';

export const getHttpClient = () => {
	const token = getToken();
	return axios.create({
		baseURL: '/services/api',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
	});
};

export const makeRequest = getHttpClient();

export default makeRequest;
