import CustomerService from '@/assets/svg/CustomerService';
import FastDelivery from '@/assets/svg/FastDelivery';
import Guarantee from '@/assets/svg/Guarantee';
import { Flex } from 'antd';

const ServiceItem = ({
	Icon,
	title,
	desc,
}: {
	readonly Icon: React.ReactNode;
	readonly title: string;
	readonly desc: string;
}) => {
	return (
		<Flex gap={24} vertical align='center' className='animate-fly-in'>
			{Icon}
			<Flex vertical gap={8} align='center'>
				<h3 className='text-2xl font-semibold uppercase'>{title}</h3>
				<p className=''>{desc}</p>
			</Flex>
		</Flex>
	);
};
export default function Serivces() {
	return (
		<Flex gap={88} align='center' justify='center' className='py-18!'>
			<ServiceItem
				Icon={<FastDelivery className='size-20' />}
				title='FREE AND FAST DELIVERY'
				desc='Free delivery for all orders over $140'
			/>
			<ServiceItem
				Icon={<CustomerService className='size-20' />}
				title='24/7 CUSTOMER SERVICE'
				desc='Friendly 24/7 customer support'
			/>
			<ServiceItem
				Icon={<Guarantee className='size-20' />}
				title='MONEY BACK GUARANTEE'
				desc='We return money within 30 days'
			/>
		</Flex>
	);
}
