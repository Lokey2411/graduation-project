import { useEffect } from 'react'
import LoginPage from '@/pages/auth/login'
import DashboardRoute from './DashboardRoute'
import { Route, Routes } from 'react-router'
import { notification } from 'antd'
import { useTokenIsValid } from '@/hooks/useTokenIsValid'

const AppRoute = () => {
	const { tokenIsValid } = useTokenIsValid()
	useEffect(() => {
		if (tokenIsValid) {
			notification.success({
				message: 'Success',
				description: 'You are logged in successfully',
			})
		} else {
			notification.error({
				message: 'Error',
				description: 'You are not logged in',
			})
		}
	}, [tokenIsValid])
	return tokenIsValid ? (
		<DashboardRoute />
	) : (
		<Routes>
			<Route path='*' element={<LoginPage />} key='login' />
		</Routes>
	)
}

export default AppRoute
