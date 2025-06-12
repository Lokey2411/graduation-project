import { AuthPage } from '@refinedev/antd'
import { Button, notification } from 'antd'
import { useState } from 'react'
import TextingText from '../../components/TextingText'
import FloatingLabelInput from '@/components/FloatingLabelInput'
import { axiosInstance } from '@refinedev/simple-rest'

const LoginPage = () => {
	const [formState, setFormState] = useState({
		email: '',
		username: '',
		password: '',
	})
	const handleLogin = () => {
		axiosInstance
			.post('/services/api/auth/login', formState)
			.then(res => {
				console.log(res)
				if (res.status === 200) {
					notification.success({
						message: 'Success',
						description: 'You are logged in successfully',
					})
					const { token } = res.data
					localStorage.setItem('token', token)
					window.location.reload()
				} else {
					notification.error({
						message: 'Error',
						description: res.status,
					})
				}
			})
			.catch(error => {
				notification.error({
					message: 'Error',
					description: error.message,
				})
			})
	}
	return (
		<AuthPage
			type='login'
			formProps={{
				initialValues: {
					email: '',
					password: '',
					username: '',
				},
				className: 'h-screen grid place-items-center',
			}}
			wrapperProps={{
				className: 'h-screen grid place-items-center',
			}}
			rememberMe={false}
			forgotPasswordLink=''
			hideForm
			renderContent={() => (
				<div className='w-fit flex flex-col gap-6 '>
					<h1 className='text-3xl font-bold hover:animate-bounce cursor-pointer text-center'>Login</h1>
					<div className='bg-white shadow-md p-5 rounded-lg flex flex-col gap-8 dark:bg-input-dark'>
						<TextingText
							className='text-primary text-3xl font-bold whitespace-nowrap'
							title='Sign in to your account'></TextingText>
						<FloatingLabelInput
							label='Email or username'
							name='email'
							value={formState.email}
							onChange={e => {
								const value = e.target.value
								setFormState({ ...formState, email: value, username: value })
							}}
						/>
						<FloatingLabelInput
							label='Password'
							name='password'
							type='password'
							value={formState.password}
							onChange={e => setFormState({ ...formState, password: e.target.value })}
						/>
						<Button onClick={handleLogin}>Login</Button>
					</div>
				</div>
			)}
			registerLink=''></AuthPage>
	)
}

export default LoginPage
