import axios from 'axios'
import { CHATBOT_API_URL } from '@/config/env'
import { PREFIX_PATH } from '@/constants'

export const apiChatbot = async (url: string, method: string, body?: any, headers?: Record<string, string>) => {
	try {
		const response = await axios({
			method: method as any,
			url: CHATBOT_API_URL + PREFIX_PATH + url,
			data: body,
			headers,
		})

		return response.data
	} catch (error: any) {
		console.error('Error in apiChatbot:', error?.response?.data ?? error)
		throw error
	}
}
