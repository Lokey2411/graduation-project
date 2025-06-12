import { IMAGE_PLACEHOLDER } from '@/commons/constansts';
import NameField from '@/components/NameField';
import { useGet } from '@/hooks/useGet';
import CategoryService from '@/services/CategoryService';
import { ICategory } from '@/types/ICategory';
import { Flex, Image, Skeleton } from 'antd';
import { Link } from 'react-router-dom';

export default function NewArrival() {
	const { data: allCategories } = useGet<ICategory[]>(CategoryService.getCategories);
	if (!allCategories || !Array.isArray(allCategories)) return <Skeleton active />;
	return (
		<div className='mx-app border-y border-gray-400 py-16'>
			<Flex vertical gap={60}>
				<NameField title='New Arrivals' name='Feature' viewAllPath='/categories' />
				<div className='grid grid-cols-2 gap-6'>
					{allCategories
						.filter(cat => cat.isNewArrival)
						.map(cat => (
							<div className='relative bg-[rgba(0,0,0,0.5)] h-full aspect-square animate-scale-x' key={cat.id}>
								<Image
									src={cat.image_url ?? IMAGE_PLACEHOLDER}
									alt={cat.name}
									rootClassName='absolute! inset-0'
									className='size-full! object-cover!'
									preview={false}
								/>
								<div className='absolute bottom-8 left-8 text-white flex flex-col gap-4'>
									<h5>{cat.name}</h5>
									<p>{cat.description}</p>
									<Link
										className='text-white!  text-base! p-px border-b border-white w-fit'
										to={`/categories/${cat.id}`}>
										Shop now
									</Link>
								</div>
							</div>
						))}
				</div>
			</Flex>
		</div>
	);
}
