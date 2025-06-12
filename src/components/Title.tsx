import { Flex } from 'antd';

export default function Title({ title }: { readonly title: string }) {
	return (
		<Flex gap={16} align='center'>
			<div className='w-5 h-10 bg-secondary-bg-2 rounded-sm'></div>
			<h3 className='text-base text-secondary-bg-2 font-semibold leading-full animate-scale-x'>{title}</h3>
		</Flex>
	);
}
