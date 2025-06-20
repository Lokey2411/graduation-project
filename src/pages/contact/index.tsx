import { useNotification } from '@/hooks/useNotification';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Flex, Form, Input, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useState } from 'react';
const ContentHeader = ({ Icon, title }: { Icon: React.ReactNode; title: string }) => (
	<div className='flex items-center h-10 gap-4'>
		<div className='h-full aspect-square rounded-full bg-secondary-bg-2 text-white text-2xl grid place-items-center'>
			{Icon}
		</div>
		<h3 className='text-base font-medium'>{title}</h3>
	</div>
);

export default function ContactPage() {
	const col1ClassName = 'col-span-1 mb-0! h-16 flex-3/12';
	const contactItemClassName = 'text-base font-normal text-black!';
	const [loading, setLoading] = useState(false);
	const [formProps] = useForm();
	const notification = useNotification();

	const handleSendMessage = (values: any) => {
		setLoading(true);
		emailjs
			.send(
				import.meta.env.VITE_CONTACT_EMAIL_SERVICE,
				import.meta.env.VITE_CONTACT_EMAIL_TEMPLATE,
				{ ...values, reply_to: values.email, to_email: 'hahaiviet24112003@gmail.com' },
				import.meta.env.VITE_CONTACT_EMAIL_PUBLIC_KEY,
			)
			.then(res => {
				if (res.status === 200) {
					notification.success({
						message: 'Success',
						description: 'Send message successfully',
					});
					formProps.resetFields();
				} else {
					notification.error({
						message: 'Error',
						description: 'Send message failed',
					});
				}
			})
			.catch(error => {
				console.log(error);
				notification.error({
					message: 'Error',
					description: 'Send message failed: ' + error,
				});
			})
			.finally(() => setLoading(false));
	};

	return (
		<div className='mx-app'>
			<Spin spinning={loading}>
				<div className='mt-20'>
					<Breadcrumb items={[{ title: <Link to='/'>Home</Link> }, { title: 'Contact' }]} />
				</div>
				<Flex gap={30} className='h-96'>
					<Card className='flex-3/12 py-10 shadow-md animate-to-right'>
						<div className='flex flex-col gap-8'>
							<div>
								<ContentHeader Icon={<PhoneOutlined />} title='Call To Us' />
								<a href='tel:0123456789' className={contactItemClassName}>
									Phone: +84 123 456 789
								</a>
							</div>
							<hr className='h-px bg-black w-full' />
							<div>
								<ContentHeader Icon={<MailOutlined />} title='Write To Us' />
								<div className='flex flex-col gap-4'>
									<p className={contactItemClassName}>Fill out our form and we will contact you within 24 hours.</p>
									<a href='mailto:test@example.com' className={contactItemClassName}>
										Email: test@example.com
									</a>
									<a href='mailto:test@example.com' className={contactItemClassName}>
										Email: test@example.com
									</a>
								</div>
							</div>
						</div>
					</Card>
					<Card className='flex-9/12 shadow-md animate-to-left' styles={{ body: { height: '100%' } }}>
						<div className='flex flex-col h-full gap-8'>
							<Form
								form={formProps}
								className='flex flex-col gap-8 flex-1 mb-8'
								onFinish={handleSendMessage}
								initialValues={{ name: '', email: '', phone: '', message: '' }}
								layout='vertical'>
								<div className='flex gap-x-4 gap-y-8 flex-wrap w-full h-fit'>
									<Form.Item
										className={col1ClassName}
										label='Name'
										name='name'
										rules={[{ required: true, message: 'Please input your name!' }]}>
										<Input />
									</Form.Item>
									<Form.Item
										className={col1ClassName}
										label='Your Email'
										name='email'
										rules={[
											{ required: true, message: 'Please input your email!' },
											{ type: 'email', message: 'Please input a valid email!' },
										]}>
										<Input type='email' />
									</Form.Item>
									<Form.Item
										className={col1ClassName}
										label='Your Phone'
										name='phone'
										rules={[{ required: true, message: 'Please input your phone number!' }]}>
										<Input type='tel' />
									</Form.Item>
								</div>
								<div className='flex-1 contact-message'>
									<Form.Item
										className='col-span-3 flex-12/12 '
										label='Message'
										name='message'
										style={{ height: '100%' }}
										rules={[{ required: true, message: 'Please input your message!' }]}
										layout='vertical'>
										<TextArea placeholder='Message' rootClassName='flex-1' className='resize-none! h-full' />
									</Form.Item>
								</div>
								<Button type='primary' htmlType='submit' className='text-base w-fit self-end leading-6 px-12! py-4!'>
									Send Message
								</Button>
							</Form>
						</div>
					</Card>
				</Flex>
			</Spin>
		</div>
	);
}
