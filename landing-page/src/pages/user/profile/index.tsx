import { useApi } from '@/context/ApiContext';
import { useNotification } from '@/hooks/useNotification';
import makeRequest from '@/services/makeRequest';
import { Button, Card, Form, Input, Skeleton } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';

export default function UserProfilePage() {
	const [form] = useForm();
	const { userProfile: user } = useApi();
	const notification = useNotification();
	const saveUser: FormProps['onFinish'] = values => {
		makeRequest
			.put('/users/profile', values)
			.then(res => {
				if (res.status === 200) {
					notification.success({
						message: 'Success',
						description: res.data,
					});
				} else {
					notification.error({
						message: 'Error',
						description: res.data,
					});
				}
			})
			.catch(error => {
				notification.error({
					message: 'Error',
					description: error.message,
				});
			});
	};
	useEffect(() => {
		if (user) {
			form.setFieldsValue({
				...user,
			});
		}
	}, [user, form]);
	if (!user) return <Skeleton active />;
	return (
		<Card className=' shadow-2xl px-20 py-10 flex-1 animate-to-left'>
			<h1 className='text-secondary-bg-2 text-2xl font-medium'>Edit your profile</h1>
			<Form form={form} className='grid grid-cols-2 gap-x-16 gap-y-6' onFinish={saveUser}>
				<Form.Item name={['fullName']} label='Full name' className='col-span-2' layout='vertical'>
					<Input />
				</Form.Item>
				<Form.Item name='username' label='Username' className='' layout='vertical' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item
					name='email'
					label='Email'
					className=''
					layout='vertical'
					rules={[{ type: 'email', message: 'Invalid email' }]}>
					<Input />
				</Form.Item>
				<div className='flex gap-8 justify-end col-span-2'>
					<Button
						type='text'
						onClick={() => {
							window.location.reload();
						}}>
						Cancel
					</Button>
					<Button type='primary' htmlType='submit' className='px-12! py-4!'>
						Save
					</Button>
				</div>
			</Form>
		</Card>
	);
}
