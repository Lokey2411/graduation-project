import { Button, Flex, Modal } from 'antd';
import AuthImage from './AuthImage';
import AuthInput from './AuthInput';
import { useState } from 'react';
import { IUser } from '@/types/IUser';
import { checkEmail } from '@/commons/checkEmail';
import { makeRequest } from '@/services/makeRequest';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { useNotification } from '@/hooks/useNotification';

export default function SignUp({
	setIsSignUp,
}: {
	readonly setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<IUser>({
		id: -1,
		username: '',
		fullName: '',
		email: '',
		password: '',
	});

	const onFormDataChange = (name: keyof typeof formData, value: string) => {
		setFormData(formData => ({
			...formData,
			[name]: value,
		}));
	};
	const api = useNotification();

	const signUp = () => {
		const isValidEmail = checkEmail(formData.email);
		if (!isValidEmail) {
			api.error({
				message: 'Invalid email',
				description: 'Please enter a valid email address',
			});
		} else {
			setLoading(true);
			makeRequest
				.post('/auth/signup', formData)
				.then(res => {
					if (res.status === 200) {
						api.success({
							message: 'Success',
							description: res.data.message,
							showProgress: true,
						});
						localStorage.setItem('token', res.data.token);
						window.location.reload();
					} else {
						api.error({
							message: 'Error',
							description: res.data.message,
						});
						alert(res.data.message);
						throw new Error(res.data.message);
					}
				})
				.catch(error => {
					api.error({
						type: 'error',
						message: 'Error',
						description: error.message,
					});
				})
				.finally(() => setLoading(false));
		}
	};
	return (
		<div className='mr-app flex justify-between items-center gap-12'>
			<Modal open={loading} footer={null} closable={false} centered className='animate-fly-in grid place-items-center'>
				<Loading3QuartersOutlined className='animate-spin' />
			</Modal>
			<AuthImage className='animate-to-right flex-1/2' />
			<Flex vertical gap={48} className='animate-to-left flex-1/2'>
				<Flex vertical gap={24}>
					<h1 className='text-3xl font-medium'>Create an account</h1>
					<p className='text-base'>Enter your details below</p>
				</Flex>
				<Flex vertical gap={40}>
					<AuthInput
						placeholder='Name'
						onChange={e => {
							onFormDataChange('fullName', e.target.value);
							onFormDataChange('username', e.target.value);
						}}
					/>
					<AuthInput placeholder='Email' type='email' onChange={e => onFormDataChange('email', e.target.value)} />
					<AuthInput
						type='password'
						placeholder='Password'
						onChange={e => onFormDataChange('password', e.target.value)}
					/>
					<Flex gap={16} vertical>
						<Button
							type='primary'
							className='py-4! text-base!'
							onClick={() => {
								signUp();
							}}>
							Create Account
						</Button>
						<Flex gap={16}>
							<p className='text-base'>Already have an account?</p>
							<Button
								onClick={() => setIsSignUp(false)}
								className='border-0! border-b! rounded-none! px-0! border-black! font-medium text-black!'>
								Log in
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</div>
	);
}
