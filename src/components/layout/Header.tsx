import { Badge, Button, Dropdown, Flex, Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
	CloseCircleOutlined,
	DownOutlined,
	HeartOutlined,
	LogoutOutlined,
	ShoppingCartOutlined,
	ShoppingOutlined,
	UserOutlined,
} from '@ant-design/icons';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getToken } from '@/commons/getToken';
import { useApi } from '@/context/ApiContext';

const navigationLabels = [
	{
		path: '/',
		display: 'Home',
	},
	{
		path: '/contact',
		display: 'Contact',
	},
	{
		path: '/products',
		display: 'Products',
	},
	{
		path: '/about',
		display: 'About',
	},
	{
		path: '/auth',
		display: 'Your Account',
	},
];

const iconClassName = 'text-2xl !text-black';
const profileControlClassName = 'border-0! bg-transparent! text-white! justify-start!';
export default function Header() {
	const { pathname } = useLocation();
	const { allProducts } = useApi();
	const {
		wishlist: { length: wishlistCount },
		orders: { length: cartCount },
	} = useApi();
	const languageItems: MenuProps['items'] = [
		{
			key: '1',
			label: <Link to='/vi'>Tiếng Việt</Link>,
		},
	];
	const initialNavigationItems: MenuProps['items'] = navigationLabels.map(item => ({
		key: item.path,
		label: (
			<Link to={item.path} className={'text-base'}>
				{item.display}
			</Link>
		),
		className: clsx('hover:after:!border-[rgba(0,0,0,0.5)]', {
			'after:!border-[rgba(0,0,0,0.5)]': pathname === item.path,
		}),
	}));
	const isLoggedIn = !!getToken();
	const [navigationItems, setNavigationItems] = useState(initialNavigationItems);
	useEffect(() => {
		if (isLoggedIn) setNavigationItems(initialNavigationItems.filter(item => item && item.key !== '/auth'));
	}, []);
	return (
		<header className='sticky top-0 inset-x-0 z-50 shadow-md '>
			<Flex className='!py-3 w-full !px-app bg-black' align='center' justify='space-between'>
				<div className='w-25'></div>
				<Flex gap={8} align='center' className=''>
					<p className='text-primary-text text-md'>
						Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
					</p>
					<Link to='/' className='!text-white hover:!text-primary-text  !underline'>
						Shop Now
					</Link>
				</Flex>
				<Dropdown className='text-white w-25 justify-end' menu={{ items: languageItems }}>
					<Flex gap={5}>
						<p>English</p>
						<DownOutlined className='text-white' />
					</Flex>
				</Dropdown>
			</Flex>
			<Flex className='!pt-10 !pb-4 !px-app bg-white' justify='space-between' align='flex-end'>
				<Link to='/'>
					<h1 className='font-Inter text-2xl font-bold leading-full cursor-pointer '>Exclusive</h1>
				</Link>
				<div className='self-end w-full flex justify-center'>
					<Menu
						items={navigationItems}
						mode='horizontal'
						color='rgba(0,0,0,0.5)'
						className='!border-b-0 w-full! justify-center'
					/>
				</div>
				<Flex gap={24} align='center' className='!py-1'>
					<select
						className='outline-none border bg-transparent  transition-all p-2  rounded'
						onChange={e => {
							window.location.href = `/products/${e.target.value}`;
						}}
						defaultValue={''}>
						<option value='' disabled>
							What are you looking for?
						</option>
						{Array.isArray(allProducts) &&
							allProducts.map(prd => (
								<option key={prd.id} value={prd.id}>
									{prd.name}
								</option>
							))}
					</select>
					<Flex gap={16} align='center'>
						<Link to='/wishlist' className='relative'>
							<Badge count={wishlistCount}>
								<HeartOutlined className={iconClassName} />
							</Badge>
						</Link>
						<Link to='/cart' className='relative'>
							<Badge count={cartCount}>
								<ShoppingCartOutlined className={iconClassName} />
							</Badge>
						</Link>
						{isLoggedIn && (
							<div className='size-8 group relative'>
								<img
									src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
									alt='avatar'
									className='size-full rounded-full'
								/>
								<div
									className='absolute top-full rounded shadow-lg hidden group-hover:flex group-hover:animate-fly-in right-0 flex-col gap-4 p-5'
									style={{
										backgroundColor: 'rgba(0, 0, 0, 0.4)',
										backdropFilter: 'blur(150px)',
									}}>
									<Button href='/user/profile' icon={<UserOutlined />} className={profileControlClassName}>
										Manage Account
									</Button>
									<Button
										href='/user/orders'
										onClick={() => window.location.reload()}
										icon={<ShoppingOutlined />}
										className={profileControlClassName}>
										My Order
									</Button>

									<Button
										href={'/user/orders?status=canceled'}
										onClick={() => {
											window.location.reload();
										}}
										icon={<CloseCircleOutlined />}
										className={profileControlClassName}>
										My Cancellations
									</Button>
									<Button
										icon={<LogoutOutlined />}
										className={profileControlClassName}
										onClick={() => {
											localStorage.removeItem('token');
											window.location.reload();
										}}>
										Logout
									</Button>
								</div>
							</div>
						)}
					</Flex>
				</Flex>
			</Flex>
		</header>
	);
}
