import { useGet } from '@/hooks/useGet';
import UserService from '@/services/UserService';
import { Button, Card, Form, Skeleton, Table } from 'antd';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { EyeFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
export default function OrdersPage() {
	// get query string
	const { search } = useLocation();
	const { data: orders } = useGet(async () => await UserService.getOrdres(search));
	const { data: addresses } = useGet<any[]>(UserService.getAddresses);
	const [dataSource, setDataSource] = useState<any[]>([]);
	const defaultFilters = {
		address: '',
	};
	const [filters, setFilters] = useState(defaultFilters);
	useEffect(() => {
		if (!orders || !Array.isArray(orders)) return;
		if (JSON.stringify(filters) === JSON.stringify(defaultFilters)) setDataSource(orders);
		if (filters.address) {
			setDataSource(orders.filter((order: any) => order.address.toLowerCase() === filters.address.toLowerCase()));
		}
	}, [orders, filters]);
	if (!orders || !Array.isArray(orders)) return <Skeleton active />;
	return (
		<Card className='flex-1 flex flex-col gap-10 shadow-md'>
			<h1 className='text-2xl font-semibold'>Manage your order</h1>
			<Form>
				<Form.Item label='Address'>
					<select
						className='w-full border rounded transition-all duration-300 ease-in-out p-2'
						onChange={e => setFilters({ ...filters, address: e.target.value })}>
						<option value=''>All</option>
						{addresses &&
							Array.isArray(addresses) &&
							addresses.map((address: any) => (
								<option key={address.id} value={address.address}>
									{address.address}
								</option>
							))}
					</select>
				</Form.Item>
			</Form>
			<Table dataSource={dataSource}>
				<Table.Column
					dataIndex='id'
					title='ID'
					sortDirections={['ascend', 'descend']}
					sorter={(a, b) => a.id - b.id}
					defaultSortOrder={'descend'}
				/>
				<Table.Column dataIndex='STATUS' title='Status' />
				<Table.Column
					dataIndex='price'
					title='Price'
					sortDirections={['ascend', 'descend']}
					sorter={(a, b) => a.price - b.price}
				/>
				<Table.Column
					dataIndex='orderDate'
					title='Order date'
					render={date => moment(date).format('DD/MM/YYYY')}
					sortDirections={['ascend', 'descend']}
					sorter={(a, b) => moment(a.orderDate).unix() - moment(b.orderDate).unix()}
				/>
				<Table.Column dataIndex='address' title='Address' />
				<Table.Column
					title='Actions'
					render={(_, record: any) => (
						<Button
							type='link'
							icon={<EyeFilled style={{ fontSize: 24 }} />}
							href={`/user/orders/${record.id}`}></Button>
					)}
				/>
			</Table>
		</Card>
	);
}
