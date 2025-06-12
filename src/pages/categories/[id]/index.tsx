import ProductList from '@/components/ProductList';
import { useGet } from '@/hooks/useGet';
import NotFound from '@/pages/not-found';
import CategoryService from '@/services/CategoryService';
import { ICategory } from '@/types/ICategory';
import { IProduct } from '@/types/IProduct';
import { Breadcrumb, Button, Result } from 'antd';
import { Link, useParams } from 'react-router-dom';

export default function CategoryPage() {
	const { id } = useParams();
	const { data: products } = useGet<IProduct[]>(async () => await CategoryService.getProducts(id ? +id : 0));
	const { data: category } = useGet<ICategory>(async () => await CategoryService.getCategory(id ? +id : 0));
	if (!id || !category || !products || !Array.isArray(products)) return <NotFound />;
	return (
		<div className='flex flex-col gap-20 my-20'>
			<Breadcrumb
				items={[{ title: <Link to='/'>Home</Link> }, { title: 'Categories' }, { title: category.name }]}
				className='mx-app! animate-to-right'
			/>
			{products.length > 0 ? (
				<ProductList name={category.name} products={products} title={category.name} viewAllPosition='hide' />
			) : (
				<Result
					status='404'
					title='404'
					subTitle='Sorry, the category you choose not have any product.'
					extra={
						<Button type='primary' href='/' size='large'>
							Back Home
						</Button>
					}
				/>
			)}
		</div>
	);
}
