import { Button, Flex } from 'antd';
import React from 'react';
import Title from './Title';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import ViewAllButton from './ViewAllButton';

const NameField = ({
	title,
	name,
	control,
	isCarousel,
	handlePrev,
	handleNext,
	viewAllPath,
	showControl = true,
}: {
	title: string;
	name: string;
	showControl?: boolean;
	isCarousel?: boolean;
	handlePrev?: () => void;
	handleNext?: () => void;
	control?: React.ReactNode;
	viewAllPath?: string;
}) => {
	const Pagination = isCarousel ? (
		<Flex align='center' gap={8}>
			<Button type='primary' className='size-12! text-2xl! rounded-full! p-0! ' onClick={handlePrev}>
				<ArrowLeftOutlined />
			</Button>
			<Button type='primary' className='size-12! text-2xl! rounded-full! p-0! ' onClick={handleNext}>
				<ArrowRightOutlined />
			</Button>
		</Flex>
	) : (
		<ViewAllButton path={viewAllPath ?? '/'} />
	);
	return (
		<Flex vertical gap={20}>
			<Title title={name} />
			<Flex className='w-full' align={'center'} justify='space-between'>
				<Flex align='center' justify='space-between' className='w-1/2  '>
					<h1 className='text-3xl font-semibold animate-to-right'>{title}</h1>
					{control}
				</Flex>
				{showControl && Pagination}
			</Flex>
		</Flex>
	);
};

export default NameField;
