import { IProduct } from '@/types/IProduct';
import { Carousel, Flex } from 'antd';
import { CarouselProps, CarouselRef } from 'antd/es/carousel';
import React, { memo } from 'react';
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
	const [ready, setReady] = React.useState(false);

	// Đợi tất cả product card render xong
	React.useEffect(() => {
		const timeout = setTimeout(() => {
			setReady(true);
		}, 500); // Delay để lazy-load kịp (tùy anh chỉnh)

		return () => clearTimeout(timeout);
	}, [products.length]);

	// Sau khi ready, reset vị trí scroll
	React.useEffect(() => {
		if (ready && carouselRef.current) {
			// react-slick gọi gốc là slickGoTo
			try {
				carouselRef.current.goTo?.(0, false);
			} catch (e) {
				// fallback nếu API khác
				console.log(e);
				carouselRef.current.goTo?.(0, false);
			}
		}
	}, [ready]);

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
					<div className=' grid grid-cols-4 gap-7'>
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

export default memo(ProductList);
