import BooleanField from '@/components/BooleanField'
import DeleteButton from '@/components/DeleteButton'
import { EditButton, List, ShowButton, useTable } from '@refinedev/antd'
import { useList, type BaseRecord } from '@refinedev/core'
import { Space, Table } from 'antd'
import { useMemo } from 'react'

export const ProductList = () => {
	const { tableProps } = useTable({
		syncWithLocation: true,
	})

	const { data: categories } = useList({
		resource: 'categories',
	})

	// Tạo danh sách filter từ categories với useMemo để tối ưu hiệu suất
	const categoryFilters = useMemo(() => {
		return (
			categories?.data?.map(category => ({
				text: category.name,
				value: category.id ? +category.id : 0,
			})) || []
		)
	}, [categories?.data])

	const getCategoryName = (categoryId: number | string) => {
		const category = categories?.data.find(category => category.id === categoryId)
		return category?.name ?? 'N/A'
	}

	return (
		<List>
			<Table {...tableProps} rowKey='id'>
				<Table.Column dataIndex='id' title='ID' />
				<Table.Column dataIndex='name' title='Name' />
				<Table.Column
					dataIndex='description'
					title='Description'
					render={desc => <p className='line-clamp-2'>{desc}</p>}
				/>
				<Table.Column dataIndex='price' title='Price' />
				<Table.Column align='center' dataIndex='discount' title='Discount' render={discount => discount ?? 0} />
				<Table.Column dataIndex='priceAfterDiscount' title='Price after discount' render={price => price} />
				<Table.Column
					dataIndex='isBestSale'
					title='Best sale'
					align='center'
					render={isBestSale => <BooleanField className='text-center mx-auto' value={!!isBestSale} />}
				/>
				<Table.Column
					dataIndex='category_id'
					title='Category'
					align='center'
					onFilter={(value, record) => value === record.category_id}
					render={categoryId => getCategoryName(categoryId)}
					filtered
					filters={categoryFilters}
					filterDropdownProps={{
						placement: 'bottomRight',
						overlayStyle: {
							zIndex: 1000,
							position: 'absolute',
							top: 0,
							overflowY: 'auto',
						},
					}}
				/>
				<Table.Column
					title='Actions'
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
