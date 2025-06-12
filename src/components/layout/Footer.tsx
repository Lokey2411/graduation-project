import { SendOutlined } from '@ant-design/icons';
import { Flex, Image, Input, QRCode } from 'antd';
import FooterItem from './FooterItem';
import IconFacebook from '@/assets/svg/IconFacebook';
import IconTwitter from '@/assets/svg/IconTwitter';
import IconInstagram from '@/assets/svg/IconInstagram';
import IconLinkedIn from '@/assets/svg/IconLinkedIn';
const Title = ({ children }: { readonly children: React.ReactNode }) => (
	<h3 className='font-Inter font-bold text-2xl leading-full text-primary-text mb-2'>{children}</h3>
);

const Subtitle = ({ children }: { readonly children: React.ReactNode }) => (
	<h4 className='text-lg font-bold text-primary-text leading-full mb-2'>{children}</h4>
);

const Text = ({ children }: { readonly children: React.ReactNode }) => (
	<p className='text-primary-text font-normal text-base leading-full'>{children}</p>
);

const footerItems = [
	[
		<Title key={1}>Exclusive</Title>,
		<Subtitle key={2}>Subscribe</Subtitle>,
		<Flex key={3} gap={16} vertical>
			<Text>Get the latest news and updates from our site</Text>
			<Input
				placeholder='Enter your email'
				className='!bg-transparent border-white border text-base !px-4 !py-3 rounded-sm !text-primary-text '
				classNames={{
					input: 'placeholder:!text-primary-text placeholder:opacity-40',
				}}
				suffix={<SendOutlined className='!text-primary-text' />}
			/>
		</Flex>,
	],
	[
		<Title key={1}>Support</Title>,
		<Text key={2}>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</Text>,
		<Text key={3}>exclusive@gmail.com</Text>,
		<Text key={4}>+88015-88888-9999</Text>,
	],
	[
		<Title key={1}>Account</Title>,
		<Text key={2}>My Account</Text>,
		<Text key={3}>Login / Register</Text>,
		<Text key={4}>Cart</Text>,
		<Text key={5}>Wishlist</Text>,
		<Text key={6}>Shop</Text>,
	],
	[
		<Title key={1}>Quick Link</Title>,
		<Text key={2}>Privacy Policy</Text>,
		<Text key={3}>Term Of Use</Text>,
		<Text key={4}>FAQ</Text>,
		<Text key={5}>Contact</Text>,
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
						/>
					</div>
					<div className='flex-1'>
						<Image
							src='/static/images/footer/app-store.png'
							alt='Get it on App store'
							wrapperClassName='w-full'
							className='size-full object-cover'
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

export default function Footer() {
	return (
		<footer className='bg-black animate-fly-in'>
			<Flex className='!px-app !py-20' justify='space-between' gap={80}>
				{footerItems.map((items, index) => (
					<FooterItem key={index + 0} items={items} />
				))}
			</Flex>
		</footer>
	);
}
