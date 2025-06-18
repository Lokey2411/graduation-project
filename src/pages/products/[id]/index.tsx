import FastDelivery from '@/assets/svg/FastDelivery';
import Return from '@/assets/svg/Return';
import withLazyOnScroll from '@/commons/withLazyOnScroll';
import { useApi } from '@/context/ApiContext';
import { useGet } from '@/hooks/useGet';
import { useNotification } from '@/hooks/useNotification';
import NotFound from '@/pages/not-found';
import OrderService from '@/services/OrderService';
import ProductService from '@/services/ProductService';
import { IProduct } from '@/types/IProduct';
import { IVariant } from '@/types/IVariant';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Image, InputNumber, theme } from 'antd';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
const ProductList = withLazyOnScroll(() => import('@/components/ProductList'));

export default function ProductDetailPage() {
	const { id: productId } = useParams();
	const id = productId ? +productId : -11;
	const notification = useNotification();
	const fetchProductData = async (id: number) => {
		const [productDetail, images, relatedProducts, variants] = await Promise.all([
			ProductService.getProductById(id),
			ProductService.getProductImages(id),
			ProductService.getRelatedProducts(id),
			ProductService.getProductVariants(id),
		]);
		return { productDetail, images, relatedProducts, variants };
	};

	const {
		data: { productDetail, images, relatedProducts, variants },
	} = useGet<{
		productDetail: IProduct;
		images: string[];
		relatedProducts: IProduct[];
		variants: IVariant[];
	}>(
		async () => await fetchProductData(id),
		error => {
			notification.error({ message: 'Error', description: error.message });
		},
	);
	const { wishlist: favorites } = useApi();
	let variantGroupedByType = useMemo(() => {
		if (!Array.isArray(variants)) return {};
		let variant: { [type: string]: IVariant[] } = {};
		variants.forEach(variantItem => {
			if (!variant[variantItem.variantType]) variant[variantItem.variantType] = [];
			variant[variantItem.variantType].push(variantItem);
		});
		return variant;
	}, [variants]);
	const isFavorited = useMemo(() => {
		return Array.isArray(favorites) && favorites.some(favorite => favorite.product_id === productDetail.id);
	}, [favorites]);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [currentVariant, setCurrentVariant] = useState<IVariant | null>(null);
	const imageNotCurrent = useMemo(() => {
		return Array.isArray(images) ? images.filter((_, index) => index !== currentImageIndex) : [];
	}, [images, currentImageIndex]);
	const currentImage = images[currentImageIndex];
	if (!productDetail) return <NotFound />;

	const handleChangeCurrentVariant = (variant: IVariant) => {
		setCurrentVariant(prev => {
			const prevId = prev?.id;
			return prevId === variant.id ? null : variant;
		});
	};
	const handleFavorite = async () => {
		let price = Number(currentVariant?.price);
		if (!price) price ??= +(productDetail?.priceAfterDiscount ?? productDetail.price);
		if (isFavorited) {
			const response = await OrderService.removeFromCart({ id: productDetail.id, product_id: productDetail.id });
			if (response.status === 200) {
				notification.success({
					message: 'Success',
					description: 'Remove from favorite successfully',
				});
			} else {
				notification.error({
					message: 'Error',
					description: 'Remove from favorite failed',
				});
			}
		} else {
			if (!currentVariant) {
				notification.error({
					message: 'Error',
					description: 'Please select a variant',
				});
			}
			const response = await OrderService.addToCart({
				price: price * quantity,
				quantity,
				product_id: productDetail.id,
				variant_id: currentVariant?.id ?? 0,
				status: 'favorite',
			});
			if (response.status === 200) {
				notification.success({
					message: 'Success',
					description: 'Add to favorite successfully',
				});
			}
		}
	};

	const addToCart = async () => {
		if (!currentVariant) {
			notification.error({
				message: 'Error',
				description: 'Please select a variant',
			});
		}
		let price = Number(currentVariant?.price);
		if (!price) price ??= +(productDetail?.priceAfterDiscount ?? productDetail.price);
		const response = await OrderService.addToCart({
			price: price * quantity,
			quantity,
			product_id: productDetail.id,
			variant_id: currentVariant?.id ?? 0,
			status: 'carting',
		});
		if (response.status === 200) {
			notification.success({
				message: 'Success',
				description: 'Add to cart successfully',
			});
			window.location.reload();
		} else {
			notification.error({
				message: 'Error',
				description: response.data,
			});
		}
	};
	return (
		<div className=' mt-10'>
			<div className='mx-app'>
				<Breadcrumb
					className='animate-to-right mb-10!'
					items={[
						{
							title: <Link to={'/'}>Home</Link>,
						},
						{
							title: <Link to={'/products'}>Products</Link>,
						},
						{
							title: productDetail.name,
						},
					]}
				/>
				<Flex
					justify='space-between'
					gap={70}
					style={{
						height: 600,
					}}>
					<Flex gap={30} className='flex-1 overflow-hidden'>
						<Flex gap={16} vertical className='h-full'>
							{imageNotCurrent.map((image, index) => (
								<Image
									key={index + 0}
									src={image}
									rootClassName='size-20 object-cover'
									className='size-full aspect-square object-cover cursor-pointer hover:animate-pulse'
									preview={false}
									onClick={() => setCurrentImageIndex(index)}
								/>
							))}
						</Flex>
						<Image src={currentImage} rootClassName='flex-1 bg-secondary-bg' className='size-full!  object-filled' />
					</Flex>
					<Flex vertical className='max-w-96' justify='space-between' gap={24}>
						<Flex vertical gap={16}>
							<div className='text-2xl font-semibold'>{productDetail.name}</div>
							<div className='text-2xl animate-fly-in' key={currentVariant?.id}>
								${currentVariant?.price ?? productDetail.price}
							</div>
							<div className='text-base line-clamp-3' title={productDetail.description}>
								{productDetail.description}
							</div>
						</Flex>
						<hr className='h-px w-96  bg-black' />
						{Object.keys(variantGroupedByType).map(type => (
							<div key={type} className='flex gap-x-6 gap-y-2 items-center w-full flex-wrap'>
								<div className='text-lg font-semibold'>{type}</div>
								{variants.map(variant => (
									<Button
										key={variant.id}
										className={clsx(
											'border border-black rounded-sm px-3 py-2 cursor-pointer group transition-all duration-300',
										)}
										style={{
											borderColor: currentVariant?.id === variant.id ? theme.defaultConfig.token.colorPrimary : 'black',
										}}
										onClick={() => handleChangeCurrentVariant(variant)}>
										<div className='group-hover:animate-bounce'>
											<div
												className='text-lg font-semibold line-clamp-1 transition-all duration-300'
												title={variant.name}
												style={{
													color: currentVariant?.id === variant.id ? theme.defaultConfig.token.colorPrimary : 'black',
												}}>
												{variant.name}
											</div>
										</div>
									</Button>
								))}
							</div>
						))}
						<Flex vertical gap={40}>
							<Flex justify='space-between' align='center' gap={16}>
								<Flex align='center' gap={16}>
									<InputNumber value={quantity} min={1} onChange={value => setQuantity(value ?? 0)} />
									<Button
										type='primary'
										className='px-12! py-2.5! text-base font-medium rounded-sm!'
										onClick={addToCart}>
										Buy Now
									</Button>
								</Flex>
								<Button className='size-10! ' onClick={handleFavorite}>
									{isFavorited ? (
										<HeartFilled style={{ fontSize: 32 }} />
									) : (
										<HeartOutlined
											style={{
												fontSize: 32,
											}}
										/>
									)}
								</Button>
							</Flex>
							<div className='border rounded-sm border-black px-4 py-6 flex flex-col gap-4'>
								<div className='flex gap-4 items-center'>
									<FastDelivery className='size-10' />
									<div className='flex flex-col gap-2'>
										<h3 className='text-base font-medium'>Free Delivery</h3>
										<p className='text-xs font-medium underline'>Enter your postal code for Delivery Availability</p>
									</div>
								</div>
								<hr className='h-px  bg-black -mx-4' />
								<div className='flex gap-4 items-center'>
									<Return className='size-10' />
									<div className='flex flex-col gap-2'>
										<h3 className='text-base font-medium'>Return Delivery</h3>
										<p className='text-xs'>Free 30 Days Delivery Returns</p>
									</div>
								</div>
							</div>
						</Flex>
					</Flex>
				</Flex>
			</div>

			<div className='my-40'>
				{Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
					<ProductList name='Related' products={relatedProducts} viewAllPosition='hide' title='Related' />
				)}
			</div>
		</div>
	);
}
