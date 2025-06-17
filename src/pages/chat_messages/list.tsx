import BooleanField from '@/components/BooleanField'
import { FileSyncOutlined } from '@ant-design/icons'
import { List, ShowButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { Button, Space, Table } from 'antd'
import moment from 'moment'

export const ChatList = () => {
	const { tableProps } = useTable({
		syncWithLocation: true,
		resource: 'chat',
	})
	return (
		<List
			createButtonProps={{
				title: 'Add new document',
				children: 'Add new document',
				href: '/documents/create',
				onClick: () => {
					window.location.href = '/documents/create'
				},
			}}
			headerButtons={({ defaultButtons }) => (
				<>
					{defaultButtons}
					<Button type='primary' icon={<FileSyncOutlined />} href='/documents'>
						Manage documents
					</Button>
				</>
			)}>
			<Table {...tableProps} rowKey='id'>
				<Table.Column dataIndex='id' title={'ID'} />
				<Table.Column dataIndex='question' title={'Question'} />
				<Table.Column dataIndex='answer' title={'Answer'} render={desc => <p className='line-clamp-2'>{desc}</p>} />
				<Table.Column
					dataIndex='created_at'
					title={'Chat at'}
					align='center'
					render={date => moment(date).format('YYYY-MM-DD HH:mm:ss')}
				/>
				<Table.Column
					dataIndex='isDelete'
					title='User deleted'
					align='center'
					render={isDelete => <BooleanField className='text-center mx-auto' value={!!isDelete} />}
				/>
				<Table.Column
					title={'Actions'}
					dataIndex='actions'
					align='center'
					render={(_, record: BaseRecord) => (
						<Space align='center'>
							<ShowButton hideText size='small' recordItemId={record.user_id ?? record.sessionId} />
						</Space>
					)}
				/>
			</Table>
		</List>
	)
}
