import { IProduct } from '@/types/IProduct';
import { Carousel, Flex } from 'antd';
import { CarouselProps, CarouselRef } from 'antd/es/carousel';
import React from 'react';
import withLazyOnScroll from '@/commons/withLazyOnScroll';
import ViewAllButton from './ViewAllButton';

const ProductCard = withLazyOnScroll(() => import('./ProductCard'));
const NameField = withLazyOnScroll(() => import('./NameField'));

const ProductList = ({
	name,
	title,
	products,
	viewAllPosition,
	control,
	carouselProps,
}: {
	title: string;
	name: string;
	control?: React.ReactNode;
	products: IProduct[];
	viewAllPosition: 'top' | 'bottom' | 'hide';
	carouselProps?: CarouselProps;
}) => {
	const carouselRef = React.useRef<CarouselRef>(null);

	return (
		<div className='mx-app'>
			<Flex vertical gap={60}>
				<NameField
					name={name}
					title={title}
					control={control}
					isCarousel={viewAllPosition === 'bottom'}
					showControl={viewAllPosition !== 'hide'}
					handlePrev={() => carouselRef.current?.prev()}
					handleNext={() => carouselRef.current?.next()}
					viewAllPath='/products'
				/>

				{viewAllPosition === 'top' || viewAllPosition === 'hide' ? (
					<div className=' flex gap-7'>
						{products.map(product => (
							<ProductCard key={product.id} {...product} />
						))}
					</div>
				) : (
					viewAllPosition === 'bottom' && (
						<div className='max-w-screen flex flex-col gap-16'>
							<Carousel
								ref={carouselRef}
								dots={false}
								waitForAnimate
								draggable
								variableWidth
								style={{
									height: 416,
								}}
								className='product-list-carousel -mr-app!'
								swipeToSlide
								{...carouselProps}>
								{products.map(product => (
									<ProductCard key={product.id} {...product} />
								))}
							</Carousel>
							<div className='self-center'>
								<ViewAllButton path='/products' />
							</div>
						</div>
					)
				)}
			</Flex>
		</div>
	);
};

export default ProductList;
