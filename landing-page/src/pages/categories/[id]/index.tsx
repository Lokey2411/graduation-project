import withLazyOnScroll from '@/commons/withLazyOnScroll';
import { useGet } from '@/hooks/useGet';
import NotFound from '@/pages/not-found';
import CategoryService from '@/services/CategoryService';
import { ICategory } from '@/types/ICategory';
import { IProduct } from '@/types/IProduct';
import { Breadcrumb, Button, Result } from 'antd';
import { Link, useParams } from 'react-router-dom';

const ProductList = withLazyOnScroll(() => import('@/components/ProductList'));

export default function CategoryPage() {
	const { id } = useParams();
	const fetchCategoryData = async (id: string | undefined) => {
		const categoryId = id ? +id : 0;
		const [products, category] = await Promise.all([
			CategoryService.getProducts(categoryId),
			CategoryService.getCategory(categoryId),
		]);
		return { products, category };
	};

	const {
		data: { products, category },
	} = useGet<{ products: IProduct[]; category: ICategory }>(async () => await fetchCategoryData(id));
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
