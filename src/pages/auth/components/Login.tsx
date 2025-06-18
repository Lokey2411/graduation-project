import React, { useState } from 'react';
import AuthImage from './AuthImage';
import { Button, Flex, Modal } from 'antd';
import AuthInput from './AuthInput';
import { Link } from 'react-router-dom';
import { IUser } from '@/types/IUser';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { makeRequest } from '@/services/makeRequest';
import { useNotification } from '@/hooks/useNotification';

const Login = ({ setIsSignUp }: { readonly setIsSignUp: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const [formData, setFormData] = useState<IUser>({
		id: -1,
		username: '',
		fullName: '',
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState(false);
	const notification = useNotification();
	const login = () => {
		setLoading(true);
		makeRequest
			.post('/auth/login', formData)
			.then(res => {
				if (res.status === 200) {
					setLoading(false);
					localStorage.setItem('token', res.data.token);
					notification.open({
						message: 'Success',
						description: 'Login success',
						duration: 3,
						showProgress: true,
					});
				} else {
					notification.open({
						message: 'Error',
						description: res.data,
					});
				}
				window.location.href = '/';
			})
			.catch(error => {
				notification.open({
					message: 'Error',
					description: error.message,
				});
			})
			.finally(() => setLoading(false));
	};
	return (
		<div className='ml-app flex justify-between items-center gap-12'>
			<Modal open={loading} footer={null} closable={false} className='grid place-items-center' centered>
				<Loading3QuartersOutlined className='animate-spin text-3xl' />
			</Modal>
			<Flex vertical gap={48} className='animate-to-left flex-1/2'>
				<Flex vertical gap={24}>
					<h1 className='text-3xl font-medium'>Log in to Exclusive</h1>
					<p className='text-base'>Enter your details below</p>
				</Flex>
				<Flex vertical gap={40}>
					<AuthInput
						placeholder='Email or username'
						onChange={e => setFormData({ ...formData, username: e.target.value })}
					/>
					<AuthInput
						type='password'
						placeholder='Password'
						onChange={e => setFormData({ ...formData, password: e.target.value })}
					/>
					<Flex gap={16} vertical>
						<Flex justify='space-between' align='center'>
							<Button type='primary' className='py-4! px-8! text-base!' onClick={login}>
								Login
							</Button>
							<Link to={'/auth/forgot-password'} className='text-base text-secondary-bg-2!'>
								Forgot Password?
							</Link>
						</Flex>
						<Flex gap={16}>
							<p className='text-base'>Already have an account?</p>
							<Button
								onClick={() => setIsSignUp(true)}
								className='border-0! border-b! rounded-none! px-0! border-black! font-medium text-black!'>
								Sign up
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			<AuthImage className='animate-to-right' />
		</div>
	);
};

export default Login;
