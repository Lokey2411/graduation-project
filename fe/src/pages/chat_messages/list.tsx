import BooleanField from '@/components/BooleanField'
import { FileSyncOutlined } from '@ant-design/icons'
import { List, ShowButton, useTable } from '@refinedev/antd'
import type { BaseRecord } from '@refinedev/core'
import { Space, Table } from 'antd'
import moment from 'moment'

export const ChatList = () => {
	const { tableProps } = useTable({
		syncWithLocation: true,
		resource: 'chat',
	})
	return (
		<List
			createButtonProps={{
				type: 'primary',
				icon: <FileSyncOutlined />,
				children: 'Manage documents',
				href: '/documents',
				onClick: () => {
					window.location.href = '/documents'
				},
			}}>
			<Table {...tableProps} rowKey='id'>
				<Table.Column dataIndex='id' title={'ID'} />
				<Table.Column
					dataIndex='username'
					title={'User / Session'}
					render={(username, record) => <span>{record.user_id ? username : record.sessionId}</span>}
				/>
				<Table.Column
					dataIndex='email'
					title={'Email'}
					render={email => <p className='line-clamp-2'>{email ?? 'N/A'}</p>}
				/>
				<Table.Column dataIndex='messageCount' title={'Message Count'} align='center' />
				<Table.Column
					dataIndex='lastMessageTime'
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
