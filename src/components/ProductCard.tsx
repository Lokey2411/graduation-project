import { IMAGE_PLACEHOLDER } from '@/commons/constansts';
import { useGet } from '@/hooks/useGet';
import ProductService from '@/services/ProductService';
import { IProduct } from '@/types/IProduct';
import { Image } from 'antd';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

type Props = IProduct;

const ProductCard = (product: Props) => {
	const fetchProductData = async () => {
		const [images, category] = await Promise.all([
			ProductService.getProductImages(product.id),
			ProductService.getProductCategory(product.id),
		]);
		return { images, category };
	};

	const {
		data: { images, category },
	} = useGet(fetchProductData);
	return (
		<Link
			to={`/products/${product.id}`}
			title={product.name}
			className='rounded-2xl flex flex-col gap-3 group bg-white! flex-1 max-w-72 select-none relative'>
			<Image
				onClick={e => e.stopPropagation()}
				title={product.name}
				alt={product.name}
				src={images[0] ?? IMAGE_PLACEHOLDER}
				onError={e => (e.currentTarget.src = IMAGE_PLACEHOLDER)}
				className='size-full aspect-square rounded-lg animate-land-in group-hover:skew-x-6'
				rootClassName='w-72 bg-secondary-bg rounded-sm'
				preview={false}
				loading='lazy'
			/>
			<div className='flex flex-col gap-2 animate-fly-in relative'>
				<div className='text-lg font-semibold text-black! whitespace-nowrap overflow-hidden group-hover:animate-pulse'>
					{product.name}
				</div>
				<div className='text-sm font-semibold text-white! bg-black rounded-full px-3 py-0.5 w-fit group-hover:animate-pulse'>
					{category.name}
				</div>
				<div
					className={clsx('text-sm font-semibold text-secondary-bg-2! group-hover:animate-pulse', {
						'line-through': !!product.discount,
					})}>
					${product.price}
				</div>
				{product.discount && (
					<div className='text-sm font-semibold text-secondary-bg-2 group-hover:animate-pulse'>
						${product.priceAfterDiscount}
					</div>
				)}
			</div>
		</Link>
	);
};

export default ProductCard;
