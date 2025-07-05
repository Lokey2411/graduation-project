import { useNotification } from '@/hooks/useNotification';
import makeRequest from '@/services/makeRequest';
import { Button, Card, Form, Input } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';

export default function ChangePasswordPage() {
	const [form] = useForm();
	const notification = useNotification();
	const savePassword: FormProps['onFinish'] = values => {
		makeRequest
			.patch('/users/change-password', values)
			.then(res => {
				if (res.status === 200) {
					notification.success({
						message: 'Success',
						description: res.data,
					});
					form.resetFields();
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
	return (
		<Card className='w-full shadow-2xl animate-to-left flex-1'>
			<h1 className='text-2xl font-medium mb-3 text-secondary-bg-2'>Change your password</h1>
			<Form form={form} onFinish={savePassword} layout='vertical'>
				<Form.Item label='Current password' name='currentPassword'>
					<Input.Password />
				</Form.Item>
				<Form.Item label='New password' name='password'>
					<Input.Password />
				</Form.Item>
				<Form.Item label='Confirm password' name='confirmPassword'>
					<Input.Password />
				</Form.Item>
				<div className='flex gap-2 justify-end'>
					<Button type='text' size='large'>
						Cancel
					</Button>
					<Button type='primary' htmlType='submit' size='large'>
						Save
					</Button>
				</div>
			</Form>
		</Card>
	);
}
