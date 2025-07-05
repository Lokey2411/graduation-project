import { DeleteButton, EditButton, List, ShowButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { Space, Table } from 'antd'

export const UserList = () => {
	const { tableProps } = useTable({
		syncWithLocation: true,
	})

	return (
		<List headerButtons={<></>}>
			<Table {...tableProps} rowKey='id'>
				<Table.Column dataIndex='id' title={'ID'} />
				<Table.Column dataIndex='username' title={'username'} />
				<Table.Column dataIndex='fullName' title={'Full name'} />
				<Table.Column dataIndex='email' title={'Email'} />
				<Table.Column
					title={'Actions'}
					dataIndex='actions'
					render={(_, record: BaseRecord) => (
						<Space>
							<EditButton hideText size='small' recordItemId={record.id} title='Edit user permissions' />
							<ShowButton hideText size='small' recordItemId={record.id} title='Show user permissions' />
							<DeleteButton hideText size='small' recordItemId={record.id} title='Ban user' />
						</Space>
					)}
				/>
			</Table>
		</List>
	)
}
