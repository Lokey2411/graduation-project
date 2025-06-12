import { Show, TextField } from '@refinedev/antd'
import { BaseRecord, useList, useOne, useShow } from '@refinedev/core'
import { Table, Typography } from 'antd'

const { Title } = Typography

export const OrderShow = () => {
	const { query: queryResult } = useShow({})
	const { data, isLoading } = queryResult

	const record = data?.data
	const user = useOne({
		resource: 'users',
		id: record?.userId,
	})
	const id = record?.id
	const products = useList({
		resource: `/orders/${id}/products`,
	})
	return (
		<Show isLoading={isLoading}>
			<div className='grid grid-cols-5 gap-x-3 gap-y-4'>
				<div>
					<Title level={5}>{'ID'}</Title>
					<TextField value={record?.id} />
				</div>
				<div>
					<Title level={5}>{'Status'}</Title>
					<TextField value={record?.STATUS} />
				</div>
				<div>
					<Title level={5}>{'address'}</Title>
					<TextField value={record?.address} />
				</div>
				<div>
					<Title level={5}>{'User'}</Title>
					<TextField value={user.data?.data.username} />
				</div>
				<div>
					<Title level={5}>{'Price'}</Title>
					<TextField value={record?.price} />
				</div>
				<div className='col-span-5'>
					<Title level={5}>{'Product'}</Title>
					<Table
						rowKey='variant_id'
						dataSource={products.data?.data}
						rowSelection={{
							type: 'checkbox',
							onChange: (selectedRowKeys: React.Key[], selectedRows: BaseRecord[]) => {},
							getCheckboxProps: (record: BaseRecord) => ({
								disabled: record.name === 'Disabled User', // Column configuration not to be checked
								name: record.name,
							}),
						}}>
						<Table.Column dataIndex='id' title={'ID'} />
						<Table.Column dataIndex='name' title={'Name'} />
						<Table.Column dataIndex='variant' title={'Variant'} />
						<Table.Column dataIndex='priceAfterDiscount' title={'Price after discount'} render={price => price} />
						<Table.Column dataIndex='quantity' title={'Quantity'} render={price => price} />
						<Table.Column dataIndex='userStatus' title={'User status'} render={price => price} />
					</Table>
				</div>
			</div>
		</Show>
	)
}
