import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import CommenterIcon from './CommenterIcon';
import { DollarOutlined, MoneyCollectOutlined, ShopOutlined, ShoppingOutlined } from '@ant-design/icons';

type ItemProps = {
	Icon: React.FC<Readonly<AntdIconProps>>;
	value: string;
	field: string;
};

const commenters: ItemProps[] = [
	{
		Icon: ShopOutlined,
		value: '10.5k',
		field: 'Sallers active our site',
	},
	{
		Icon: DollarOutlined,
		value: '33k',
		field: 'Monthly Product Sale',
	},
	{
		Icon: ShoppingOutlined,
		value: '45.5k',
		field: 'Customer active in our site',
	},
	{
		Icon: MoneyCollectOutlined,
		value: '25k',
		field: 'Anual gross sale in our site',
	},
];

const CommenterItem = ({ Icon, value, field }: Readonly<ItemProps>) => {
	return (
		<div className='flex-1 border border-black group hover:border-secondary-bg-2 hover:bg-secondary-bg-2 rounded hover:text-white  py-7 hover:shadow-sm grid place-items-center animate-land-in'>
			<div className='flex flex-col gap-6 items-center'>
				<CommenterIcon Icon={Icon} />
				<div className='flex flex-col gap-3 items-center'>
					<h3 className='text-3xl font-bold'>{value}</h3>
					<p className='text-base'>{field}</p>
				</div>
			</div>
		</div>
	);
};

export default function Commenter() {
	return (
		<div className='flex justify-between items-center gap-7'>
			{commenters.map(item => (
				<CommenterItem key={item.field} {...item} />
			))}
		</div>
	);
}
