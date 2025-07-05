import { ThemedLayoutV2, ThemedSiderV2 } from '@refinedev/antd'
import { NavigateToResource } from '@refinedev/react-router'
import { Outlet, Route, Routes } from 'react-router'
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from '../pages/categories'
import { UserEdit, UserList, UserShow } from '@/pages/users'
import { ErrorComponent } from '@refinedev/core'
import { Header } from '@/components'
import { ProductCreate, ProductEdit, ProductList, ProductShow } from '@/pages/products'
import { VariantCreate, VariantEdit } from '@/pages/variants'
import { ImageCreate } from '@/pages/images'
import { OrderList, OrderShow } from '@/pages/orders'
import { ChatList, ChatShow } from '@/pages/chat_messages'
import { DocumentCreate, DocumentList } from '@/pages/documents'

const DashboardRoute = () => {
	return (
		<Routes>
			<Route
				element={
					<ThemedLayoutV2
						Header={() => <Header sticky />} // NOSONAR
						Sider={props => <ThemedSiderV2 {...props} fixed />} // NOSONAR
					>
						<Outlet />
					</ThemedLayoutV2>
				}>
				<Route index element={<NavigateToResource resource='products' />} />
				<Route path='/categories'>
					<Route index element={<CategoryList />} />
					<Route path='create' element={<CategoryCreate />} />
					<Route path='edit/:id' element={<CategoryEdit />} />
					<Route path='show/:id' element={<CategoryShow />} />
				</Route>
				<Route path='/products'>
					<Route index element={<ProductList />} />
					<Route path='create' element={<ProductCreate />} />
					<Route path='edit/:id' element={<ProductEdit />} />
					<Route path='show/:id' element={<ProductShow />} />
				</Route>
				<Route path='/users'>
					<Route index element={<UserList />} />
					<Route path='edit/:id' element={<UserEdit />} />
					<Route path='show/:id' element={<UserShow />} />
				</Route>
				<Route path='/products/:id/variants'>
					<Route path='create' element={<VariantCreate />} />
					<Route path='edit/:variant_id' element={<VariantEdit />} />
				</Route>
				<Route path='/products/:id/images'>
					<Route path='create' element={<ImageCreate />} />
				</Route>
				<Route path='/orders'>
					<Route index element={<OrderList />} />
					<Route path='show/:id' element={<OrderShow />} />
				</Route>
				<Route path='/chat_messages'>
					<Route index element={<ChatList />} />
					<Route path='show/:id' element={<ChatShow />} />
				</Route>
				<Route path='/documents'>
					<Route index element={<DocumentList />} />
					<Route path='create' element={<DocumentCreate />} />
				</Route>
				<Route path='*' element={<ErrorComponent />} />
			</Route>
		</Routes>
	)
}

export default DashboardRoute
