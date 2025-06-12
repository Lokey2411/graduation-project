import { useApi } from '@/context/ApiContext';
import { Breadcrumb, Button, Menu, MenuProps, Skeleton } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function ProfileLayout() {
	const { userProfile: user } = useApi();
	const { pathname, search } = useLocation();
	if (!user) return <Skeleton active />;
	const items: MenuProps['items'] = [
		{
			key: '1',
			label: <h1 className='text-base font-medium'> Manage My Account</h1>,
			children: [
				{
					key: '/user/profile',
					label: <Link to='/user/profile'>Profile</Link>,
				},
				{
					key: '/user/address-book',
					label: <Link to='/user/address-book'>Address Book</Link>,
				},
				{
					key: '/user/change-password',
					label: <Link to='/user/change-password'>Change Password</Link>,
				},
			],
		},
		{
			key: '2',
			label: <h1 className='text-base font-medium'> Manage Orders</h1>,
			children: [
				{
					key: '/user/orders?status=completed',
					label: (
						<Button
							type='link'
							href='/user/orders?status=completed'
							onClick={() => {
								window.location.reload();
							}}>
							My Completed Orders
						</Button>
					),
				},
				{
					key: '/user/orders?status=canceled',
					label: (
						<Button
							type='link'
							href='/user/orders?status=canceled'
							onClick={() => {
								window.location.reload();
							}}>
							My Cancellations
						</Button>
					),
				},
				{
					key: '/user/orders?status=pending',
					label: (
						<Button
							type='link'
							href='/user/orders?status=pending'
							onClick={() => {
								window.location.reload();
							}}>
							My Pending Orders
						</Button>
					),
				},
			],
		},
	];
	return (
		<div className='mx-app'>
			<div className='flex flex-col gap-20'>
				<div className='flex justify-between'>
					<Breadcrumb items={[{ title: <Link to='/'>Home</Link> }, { title: 'Profile' }]} />
					<p>
						Welcome! <span className='text-secondary-bg-2'>{user.fullName}</span>
					</p>
				</div>
				<div className='flex mb-40 gap-24'>
					<Menu
						style={{ width: 256 }}
						defaultSelectedKeys={[pathname + search]}
						defaultOpenKeys={items.map(item => item?.key as string)}
						mode='inline'
						items={items}
					/>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
