import { SendOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Image, Input, QRCode } from 'antd';
import FooterItem from './FooterItem';
import IconFacebook from '@/assets/svg/IconFacebook';
import IconTwitter from '@/assets/svg/IconTwitter';
import IconInstagram from '@/assets/svg/IconInstagram';
import IconLinkedIn from '@/assets/svg/IconLinkedIn';
import emailjs from '@emailjs/browser';
import { useNotification } from '@/hooks/useNotification';
import { Link } from 'react-router-dom';
const Title = ({ children }: { readonly children: React.ReactNode }) => (
	<h3 className='font-Inter font-bold text-2xl leading-full text-primary-text mb-2'>{children}</h3>
);

const Subtitle = ({ children }: { readonly children: React.ReactNode }) => (
	<h4 className='text-lg font-bold text-primary-text leading-full mb-2'>{children}</h4>
);

const Text = ({ children }: { readonly children: React.ReactNode }) => (
	<p className='text-primary-text font-normal text-base leading-full'>{children}</p>
);

export default function Footer() {
	const notification = useNotification();
	const handleSendEmail = (email: string) => {
		emailjs
			.send(
				import.meta.env.VITE_CONTACT_EMAIL_SERVICE,
				import.meta.env.VITE_CONTACT_EMAIL_TEMPLATE,
				{
					email,
					reply_to: email,
					to_email: 'hahaiviet24112003@gmail.com',
					message: 'I wanna follow your website',
				},
				import.meta.env.VITE_CONTACT_EMAIL_PUBLIC_KEY,
			)
			.then(() => {
				notification.success({
					message: 'Success',
					description: 'Send message successfully',
				});
			})
			.catch(() => {
				notification.error({
					message: 'Error',
					description: 'Error when sending message',
				});
			});
	};

	const footerItems = [
		[
			<Title key={1}>Exclusive</Title>,
			<Subtitle key={2}>Subscribe</Subtitle>,
			<Flex key={3} gap={16} vertical>
				<Text>Get the latest news and updates from our site</Text>
				<Form onFinish={({ email }) => handleSendEmail(email)}>
					<Form.Item name='email'>
						<Input
							placeholder='Enter your email'
							className='!bg-transparent border-white border text-base !px-4 !py-3 rounded-sm !text-primary-text '
							classNames={{
								input: 'placeholder:!text-primary-text placeholder:opacity-40',
							}}
							suffix={<Button icon={<SendOutlined className='!text-primary-text' />} type='text' htmlType='submit' />}
						/>
					</Form.Item>
				</Form>
			</Flex>,
		],
		[
			<Title key={1}>Support</Title>,
			<Text key={2}>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</Text>,
			<a href='mailto:hahaiviet24112003@gmail.com'>
				<Text key={3}>hahaiviet24112003@gmail.com</Text>
			</a>,
			<a href='tel:+84978129824'>
				<Text key={4}>+84 978 129 824</Text>
			</a>,
		],
		[
			<Title key={1}>Account</Title>,
			<Link to='/user/profile'>
				<Text key={2}>My Account</Text>
			</Link>,
			<Link to='/auth'>
				<Text key={3}>Login / Register</Text>
			</Link>,
			<Link to='/cart'>
				<Text key={4}>Cart</Text>
			</Link>,
			<Link to='/wishlist'>
				<Text key={5}>Wishlist</Text>
			</Link>,
			<Link to='/products'>
				<Text key={6}>Shop</Text>
			</Link>,
		],
		[
			<Title key={1}>Download App</Title>,
			<Flex key={2} vertical gap={8}>
				<p className='text-md text-primary-text opacity-70 font-semibold'>Save $3 with App New User Only</p>
				<Flex gap={8}>
					<QRCode className='!bg-white !size-20' value={window.location.href} />
					<Flex gap={8} vertical className='flex-1'>
						<div className='flex-1 w-full'>
							<Image
								wrapperClassName='w-full'
								src='/static/images/footer/google-play.png'
								alt='Get it on Google Play'
								className='size-full object-cover'
								preview={false}
							/>
						</div>
						<div className='flex-1'>
							<Image
								src='/static/images/footer/app-store.png'
								alt='Get it on App store'
								wrapperClassName='w-full'
								className='size-full object-cover'
								preview={false}
							/>
						</div>
					</Flex>
				</Flex>
			</Flex>,
			<Flex key={3} justify='space-between'>
				<div className='size-6'>
					<IconFacebook className='!text-white text-2xl' />
				</div>
				<div className='size-6'>
					<IconTwitter className='!text-white text-2xl' />
				</div>
				<div className='size-6'>
					<IconInstagram className='!text-white text-2xl' />
				</div>
				<div className='size-6'>
					<IconLinkedIn className='!text-white text-2xl' />
				</div>
			</Flex>,
		],
	];

	return (
		<footer className='bg-black animate-fly-in'>
			<Flex className='!px-app !py-20' justify='space-between' gap={40}>
				{footerItems.map((items, index) => (
					<FooterItem key={index + 0} items={items} />
				))}
			</Flex>
		</footer>
	);
}
