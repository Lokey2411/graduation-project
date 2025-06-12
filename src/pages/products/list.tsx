import BooleanField from '@/components/BooleanField'
import DeleteButton from '@/components/DeleteButton'
import { EditButton, List, ShowButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { Space, Table } from 'antd'

export const ProductList = () => {
	const { tableProps } = useTable({
		syncWithLocation: true,
	})

	return (
		<List>
			<Table {...tableProps} rowKey='id'>
				<Table.Column dataIndex='id' title={'ID'} />
				<Table.Column dataIndex='name' title={'Name'} />
				<Table.Column
					dataIndex='description'
					title={'Description'}
					render={desc => <p className='line-clamp-2'>{desc}</p>}
				/>
				<Table.Column dataIndex='price' title={'Price'} />
				<Table.Column align='center' dataIndex='discount' title={'Discount'} render={discount => discount ?? 0} />
				<Table.Column dataIndex='priceAfterDiscount' title={'Price after discount'} render={price => price} />
				<Table.Column
					dataIndex='isBestSale'
					title={'Best sale'}
					align='center'
					render={isBestSale => <BooleanField className='text-center mx-auto' value={!!isBestSale} />}
				/>
				<Table.Column
					title={'Actions'}
					dataIndex='actions'
					render={(_, record: BaseRecord) => (
						<Space>
							<EditButton hideText size='small' recordItemId={record.id} />
							<ShowButton hideText size='small' recordItemId={record.id} />
							<DeleteButton id={record.id!} />
						</Space>
					)}
				/>
			</Table>
		</List>
	)
}
