import BooleanField from '@/components/BooleanField'
import DeleteButton from '@/components/DeleteButton'
import { EditButton, List, ShowButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { Space, Table } from 'antd'

export const CategoryList = () => {
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
				<Table.Column
					dataIndex='isNewArrival'
					title={'New arrival'}
					align='center'
					render={isNewArrival => <BooleanField className='text-center mx-auto' value={!!isNewArrival} />}
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
