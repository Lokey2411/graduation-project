import { useEffect, useState } from 'react'
import { getToken } from '../commons/getToken'

export const useTokenIsValid = () => {
	const token = getToken()
	const [tokenIsValid, setTokenIsValid] = useState(!!token)
	useEffect(() => {
		if (token) {
			// check if token is valid, then refresh
			fetch('/services/api/check-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			})
				.then(response => {
					setTokenIsValid(response.ok)
				})
				.catch(error => {
					setTokenIsValid(false)
				})
		}
	}, [token])
	return { token, tokenIsValid }
}
