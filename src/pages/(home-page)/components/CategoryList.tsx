import { IMAGE_PLACEHOLDER } from '@/commons/constansts';
import withLazyOnScroll from '@/commons/withLazyOnScroll';
import { ICategory } from '@/types/ICategory';
import { Carousel, Flex, Image, Skeleton } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
const NameField = withLazyOnScroll(() => import('@/components/NameField'));

export default function CategoryList({ allCategories }: { readonly allCategories?: ICategory[] }) {
	const categoryCarouselRef = useRef<CarouselRef>(null);
	if (!allCategories || !Array.isArray(allCategories)) return <Skeleton active />;
	return (
		<Flex gap={80} vertical className='mx-app!'>
			<hr className='w-full h-px bg-black opacity-30' />
			<NameField
				title='Browse By Categories'
				name='Categories'
				isCarousel
				handleNext={() => categoryCarouselRef.current?.next()}
				handlePrev={() => categoryCarouselRef.current?.prev()}
			/>
			<div className='max-w-screen category-carousel'>
				<Carousel dots={false} draggable infinite className='gap-3' variableWidth ref={categoryCarouselRef}>
					{allCategories?.map(category => (
						<Link
							to={`/categories/${category.id}`}
							key={category.id}
							className='grid place-items-center w-40! h-32 min-w-40 border border-black rounded overflow-hidden hover:bg-secondary-bg-2! group transition-all! duration-300!'>
							<div className='flex flex-col gap-4 items-center w-full p-6'>
								<Image
									className='size-14! aspect-square'
									src={category.image_url ?? IMAGE_PLACEHOLDER}
									onError={e => (e.currentTarget.src = IMAGE_PLACEHOLDER)}
									alt={category.name}
									preview={false}
									loading='lazy'
								/>
								<p
									title={category.name}
									className='cursor-pointer text-base  w-full line-clamp-1 text-black group-hover:text-white transition-all duration-300'>
									{category.name}
								</p>
							</div>
						</Link>
					))}
				</Carousel>
			</div>
			<hr className='w-full h-px bg-black opacity-30' />
		</Flex>
	);
}
