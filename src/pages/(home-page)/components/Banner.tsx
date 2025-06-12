import { RightOutlined } from '@ant-design/icons';
import { Carousel, Flex, Image, Menu, MenuProps } from 'antd';
import { Key, useEffect, useMemo, useState } from 'react';
import '@/assets/css/carousel.css';
import '@/assets/css/banner.css';

type BannerItem = {
	title: string;
	banners: string[];
	hasArrow?: boolean;
};

const bannerItemsLabel: BannerItem[] = [
	{
		title: "Woman's Fashion",
		banners: ['https://placehold.co/600x400', 'https://placehold.co/600x400'],
		hasArrow: true,
	},
	{
		title: "Men's Fashion",
		banners: ['https://placehold.co/600x400/EEE/31343C', 'https://placehold.co/600x400/EEE/31343C'],
		hasArrow: true,
	},
	{
		title: 'Electronics',
		banners: ['https://placehold.co/600x400/EEE/31343C', 'https://placehold.co/600x400/EEE/31343C'],
		hasArrow: false,
	},
	{
		title: 'Home & Lifestyle',
		banners: ['https://placehold.co/600x400/EEE/31343C', 'https://placehold.co/600x400/EEE/31343C'],
		hasArrow: false,
	},
	{
		title: 'Medicine',
		banners: ['https://placehold.co/600x400/EEE/31343C', 'https://placehold.co/600x400/EEE/31343C'],
		hasArrow: false,
	},
];
const CategoryMenuItem = ({ title, hasArrow }: { title: string; hasArrow?: boolean }) => {
	return (
		<Menu.Item style={{ height: 24, background: 'transparent', paddingInline: 0 }}>
			<Flex justify='space-between' align='center' className='w-full px-0!'>
				<h1 className='text-base text-black leading-full'>{title}</h1>
				{hasArrow && <RightOutlined className='text-2xl! text-black!' />}
			</Flex>
		</Menu.Item>
	);
};

const bannerItems: MenuProps['items'] = bannerItemsLabel.map(({ title, hasArrow }, index) => ({
	key: index,
	label: <CategoryMenuItem title={title} key={index + 0} hasArrow={hasArrow} />,
}));
const Banner = () => {
	const [current, setCurrent] = useState<Key>('');
	const currentItem = useMemo(() => {
		return bannerItemsLabel[Number(current)];
	}, [current]);
	useEffect(() => {
		if (bannerItems && !current && bannerItems[0]?.key) setCurrent(bannerItems[0].key);
	}, []);
	if (!bannerItems) return <></>;
	const onClick: MenuProps['onClick'] = ({ key }) => setCurrent(key);
	return (
		<Flex className='mx-app!' justify='space-between' gap={45}>
			<Menu
				onClick={onClick}
				style={{
					flex: 1,
					paddingRight: 16,
					borderRight: '1px solid #d9d9d9',
					background: 'transparent',
					color: 'white',
				}}
				defaultSelectedKeys={['1']}
				defaultOpenKeys={[current.toString()]}
				className='h-max animate-to-right'
				mode='inline'
				items={bannerItems}
			/>
			<div className='flex-4 max-w-4/5 self-end animate-to-left'>
				<Carousel autoplay autoplaySpeed={3000} draggable dotPosition='bottom' infinite className='banner-carousel'>
					{currentItem?.banners.map((banner, index) => (
						<Image
							preview={false}
							src={banner}
							alt='banner'
							className='size-full object-cover'
							wrapperClassName='w-full bg-[rgba(0,0,0,0.5)] h-full'
							key={index + 0}
						/>
					))}
				</Carousel>
			</div>
		</Flex>
	);
};

export default Banner;
