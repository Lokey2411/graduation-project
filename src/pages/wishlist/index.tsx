import ProductList from '@/components/ProductList';
import { useApi } from '@/context/ApiContext';
import ProductService from '@/services/ProductService';
import { IProduct } from '@/types/IProduct';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function WishListPage() {
	const { wishlist: wishlistProducts } = useApi();
	// get related product for each product
	const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);

	// Lấy related products khi wishlistProducts thay đổi
	useEffect(() => {
		if (!Array.isArray(wishlistProducts) || wishlistProducts.length === 0) {
			setRelatedProducts([]);
			return;
		}

		const fetchRelatedProducts = async () => {
			try {
				const relatedPromises = wishlistProducts.map(product => ProductService.getRelatedProducts(product.id));
				const relatedResults: IProduct[][] = await Promise.all(relatedPromises);
				const uniqueRelatedProducts = new Set<IProduct>(wishlistProducts);

				// Thêm các related products vào Set để đảm bảo không trùng lặp
				const addProductsToSet = (products: IProduct[]) => {
					products.forEach(product => uniqueRelatedProducts.add(product)); //NOSONAR
				};
				relatedResults.forEach(addProductsToSet);

				setRelatedProducts(Array.from(uniqueRelatedProducts));
			} catch (error) {
				console.error('Error fetching related products:', error);
				setRelatedProducts(wishlistProducts); // Fallback về wishlistProducts nếu lỗi
			}
		};

		fetchRelatedProducts();
	}, [wishlistProducts]);
	return (
		<div>
			{Array.isArray(wishlistProducts) && wishlistProducts.length > 0 ? (
				<div className='flex flex-col gap-12 my-16'>
					<ProductList
						title={`Wishlist (${wishlistProducts.length})`}
						name='Your wishlist'
						products={wishlistProducts}
						viewAllPosition='hide'
					/>
					<ProductList
						title={`Related products`}
						name='Related products'
						products={relatedProducts}
						viewAllPosition='hide'
					/>
				</div>
			) : (
				<div className='mx-app flex flex-col gap-8 items-center my-16'>
					<h1 className='text-5xl text-center'>You doesn't have any product in your wishlist</h1>
					<Link to={'/products'} className='text-3xl underline!'>
						Explore our products
					</Link>
				</div>
			)}
		</div>
	);
}
