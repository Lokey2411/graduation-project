import withLazyOnScroll from '@/commons/withLazyOnScroll';
import { useApi } from '@/context/ApiContext';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const ProductCard = withLazyOnScroll(() => import('@/components/ProductCard'));
const NameField = withLazyOnScroll(() => import('@/components/NameField'));

export default function ProductPage() {
	const { allProducts } = useApi();
	if (!allProducts || !Array.isArray(allProducts))
		return (
			<div className='grid place-items-center h-screen'>
				<Loading3QuartersOutlined spin className='text-5xl' />
			</div>
		);
	return (
		<div className='mx-app flex flex-col gap-10'>
			<Breadcrumb
				className='animate-to-right mt-4!'
				items={[
					{
						title: <Link to='/'>Home</Link>,
					},
					{
						title: 'Products',
					},
				]}
			/>
			<NameField title='Our Products' name='Products' isCarousel showControl={false} />
			<div className='grid grid-cols-4 gap-6 '>
				{allProducts.map(prd => (
					<ProductCard key={prd.id} {...prd} />
				))}
			</div>
		</div>
	);
}
