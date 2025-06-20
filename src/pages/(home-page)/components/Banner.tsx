import { RightOutlined } from '@ant-design/icons';
import { Carousel, Flex, Image, Menu, MenuProps } from 'antd';
import { Key, useEffect, useMemo, useState } from 'react';
import '@/assets/css/carousel.css';
import '@/assets/css/banner.css';

type BannerItem = {
	title: string;
	banners: string;
	hasArrow?: boolean;
};

// Đọc hình ảnh từ thư mục
const getImages = (folder: string) => {
	const images = import.meta.glob(`/public/static/images/banner/**/*.{png,jpg,jpeg,svg}`);
	return Object.keys(images).filter(item => item.includes('/' + folder));
};

const bannerItemsLabel: BannerItem[] = [
	{ title: "Woman's Fashion", banners: 'woman fashion', hasArrow: true },
	{ title: "Men's Fashion", banners: 'man fashion', hasArrow: true },
	{ title: 'Electronics', banners: 'electronics', hasArrow: false },
	{ title: 'Home & Lifestyle', banners: 'home and lifestyle', hasArrow: false },
	{ title: 'Medicine', banners: 'medicine', hasArrow: false },
];

const CategoryMenuItem = ({ title, hasArrow }: { title: string; hasArrow?: boolean }) => (
	<Menu.Item style={{ height: 24, background: 'transparent', paddingInline: 0 }}>
		<Flex justify='space-between' align='center' className='w-full px-0'>
			<h1 className='text-base text-black leading-full'>{title}</h1>
			{hasArrow && <RightOutlined className='text-2xl text-black' />}
		</Flex>
	</Menu.Item>
);

const bannerItems: MenuProps['items'] = bannerItemsLabel.map(({ title, hasArrow }, index) => ({
	key: index.toString(),
	label: <CategoryMenuItem title={title} key={index + 0} hasArrow={hasArrow} />,
}));

const Banner = () => {
	const [current, setCurrent] = useState<Key>('0');
	const currentItem = useMemo(() => bannerItemsLabel[Number(current)], [current]);

	useEffect(() => {
		if (bannerItems[0]?.key) setCurrent(bannerItems[0].key);
	}, []);

	if (!bannerItems) return <></>;

	const onClick: MenuProps['onClick'] = ({ key }) => setCurrent(key);

	return (
		<Flex className='mx-app!' justify='space-between' gap={45}>
			<Menu
				onClick={onClick}
				style={{ flex: 1, paddingRight: 16, borderRight: '1px solid #d9d9d9', background: 'transparent' }}
				defaultSelectedKeys={['0']}
				defaultOpenKeys={[current.toString()]}
				className='h-max animate-to-right'
				mode='inline'
				items={bannerItems}
			/>
			<div className='flex-4 max-w-4/5 self-end animate-to-left'>
				<Carousel autoplay autoplaySpeed={3000} draggable dotPosition='bottom' infinite className='banner-carousel'>
					{currentItem
						? getImages(currentItem.banners).map((banner, index) => (
								<Image
									preview={false}
									src={banner.replace('/public', '')}
									alt='banner'
									className='size-full object-cover'
									wrapperClassName='w-full bg-[rgba(0,0,0,0.5)] h-full'
									key={index + 0}
								/>
						  ))
						: null}
				</Carousel>
			</div>
		</Flex>
	);
};

export default Banner;
