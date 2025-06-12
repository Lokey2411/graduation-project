import withLazyOnScroll from '@/commons/withLazyOnScroll';
import { useApi } from '@/context/ApiContext';
import { Flex, Skeleton, Statistic } from 'antd';

const ProductList = withLazyOnScroll(() => import('@/components/ProductList'));
const Banner = withLazyOnScroll(() => import('./components/Banner'));
const CategoryList = withLazyOnScroll(() => import('./components/CategoryList'));
const NewArrival = withLazyOnScroll(() => import('./components/NewArrival'));
const Services = withLazyOnScroll(() => import('@/components/Services'));

const Countdown = () => {
	return (
		<Statistic.Countdown
			value={Date.now() + 1000 * 60 * 60 * 24 * 3}
			format='DD:HH:mm:ss'
			className='text-2xl font-bold'
		/>
	);
};

export default function HomePage() {
	const { allProducts } = useApi();
	if (!allProducts || !Array.isArray(allProducts)) return <Skeleton active />;
	return (
		<>
			<Flex gap={140} vertical className='pb-16!'>
				<Banner />
				<ProductList
					title='Flash Sales'
					control={<Countdown />}
					products={allProducts.filter(item => item.discount)}
					viewAllPosition='bottom'
					name="Today's"
				/>
			</Flex>
			<CategoryList />
			<div className='py-18'>
				<ProductList
					name='This month'
					title='Best Selling Products'
					products={allProducts.filter(item => item.isBestSale)}
					viewAllPosition='top'
				/>
			</div>
			<NewArrival />
			<div className='py-18'>
				<ProductList name='This month' title='Best Selling Products' products={allProducts} viewAllPosition='bottom' />
			</div>
			<Services />
		</>
	);
}
