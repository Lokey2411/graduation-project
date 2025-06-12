import React from 'react'
import { HeartOutlined, EyeOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import { IProduct } from '@/types/IProduct'

const iconClassName = 'bg-white  rounded-full shadow-md hover:bg-gray-100 size-7 cursor-pointer grid place-items-center'

const ProductItem: React.FC<IProduct> = ({ name, price, images }) => {
	return (
		<div className='max-w-xs p-3 group bg-white rounded-lg shadow-lg'>
			<div className='relative'>
				<div className='absolute top-2 right-2 flex flex-col gap-2 z-10'>
					<button aria-label='Like' className={iconClassName}>
						<HeartOutlined style={{ fontSize: 20 }} />
					</button>
					<button aria-label='View details' className={iconClassName}>
						<EyeOutlined style={{ fontSize: 20 }} />
					</button>
				</div>

				<div className='w-full aspect-square'>
					<Image
						preview={false}
						height={320}
						className='w-full object-cover h-80 rounded-md'
						src={images[0]}
						alt={name}
						loading='lazy'
					/>
				</div>

				<button className='absolute bottom-0 left-0 right-0 w-full text-base bg-white p-2 text-white font-bold opacity-0 group-hover:opacity-100 group-hover:animate-fly-in group-hover:bg-black transition-all duration-300'>
					Add to cart
				</button>
			</div>

			<div className='mt-2 text-center'>
				<p className='font-medium line-clamp-2 text-ellipsis my-1 min-h-12'>{name}</p>
				<p className='my-1 text-base font-medium text-button-2-bg'>{price}$</p>
			</div>
		</div>
	)
}

export default ProductItem
