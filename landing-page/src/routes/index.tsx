import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutApp from '@/components/layout/LayoutApp';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/(home-page)';
import { Suspense, useEffect } from 'react';
import { Skeleton } from 'antd';
import AuthPage from '@/pages/auth';
import ProductPage from '@/pages/products';
import ProductDetailPage from '@/pages/products/[id]';
import { getToken } from '@/commons/getToken';
import { makeRequest } from '@/services/makeRequest';
import { refreshToken } from '@/services/refreshToken';
import WishListPage from '@/pages/wishlist';
import CartPage from '@/pages/cart';
import { useNotification } from '@/hooks/useNotification';
import AboutPage from '@/pages/about';
import ContactPage from '@/pages/contact';
import ProfileLayout from '@/pages/user/layout';
import UserProfilePage from '@/pages/user/profile';
import AddressBookPage from '@/pages/user/address-book';
import ChangePasswordPage from '@/pages/user/change-password';
import CheckoutPage from '@/pages/checkout/[id]';
import OrdersPage from '@/pages/user/orders';
import CategoryPage from '@/pages/categories/[id]';

export default function AppRouter() {
	const token = getToken();
	const notification = useNotification();
	useEffect(() => {
		// check if token is valid
		const checkToken = async () => {
			try {
				const response = await makeRequest.post(
					'/check-token',
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
				return response;
			} catch (error) {
				console.log(error);
				notification.error({
					message: 'Error',
					description: 'Token is invalid',
				});
				// refresh token
				try {
					const token = await refreshToken();
					localStorage.setItem('token', token);
				} catch (error) {
					console.error(error);
					localStorage.removeItem('token');
				}
			}
		};
		checkToken()
			.then(res => {
				if (res?.status !== 200) {
					notification.error({
						message: 'Error',
						description: 'Token is invalid',
					});
				}
			})
			.catch(console.error);
	}, [token]);
	return (
		<BrowserRouter>
			<Suspense fallback={<Skeleton active />}>
				<Routes>
					<Route path='/' element={<LayoutApp />}>
						<Route index element={<HomePage />} />
						<Route path='/auth' element={<AuthPage />} />
						<Route path='/products' element={<ProductPage />} />
						<Route path='/products/:id' element={<ProductDetailPage />} />
						<Route path='/wishlist' element={<WishListPage />} />
						<Route path='/cart' element={<CartPage />} />
						<Route path='/about' element={<AboutPage />} />
						<Route path='/contact' element={<ContactPage />} />
						<Route path='/user' element={<ProfileLayout />}>
							<Route path='profile' element={<UserProfilePage />} />
							<Route path='address-book' element={<AddressBookPage />} />
							<Route path='change-password' element={<ChangePasswordPage />} />
							<Route path='orders' element={<OrdersPage />} />
						</Route>
						<Route path='/checkout/:id' element={<CheckoutPage />} />
						<Route path='/categories/:id' element={<CategoryPage />} />
						<Route path='*' element={<NotFound />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}
