import { SELECT_CLASS_NAME } from '@/commons/getToken'
import { IUser } from '@/types/IUser'
import {
	CarOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	InboxOutlined,
	RollbackOutlined,
} from '@ant-design/icons'
import { List, ShowButton, useSelect, useTable } from '@refinedev/antd'
import { useList, useUpdate, type BaseRecord } from '@refinedev/core'
import { Button, Form, Input, Space, Table } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

export const OrderList = () => {
	const [dataSource, setDataSource] = useState<readonly BaseRecord[]>([])
	const defaultFilters = {
		status: '',
		userId: 0,
		address: '',
	}
	const [filters, setFilters] = useState(defaultFilters)

	const { tableProps } = useTable({
		syncWithLocation: false,
		liveMode: 'auto',
	})
	const { dataSource: tableDataSource } = tableProps

	const { data: usersData } = useList<IUser>({
		resource: 'users',
	})

	const { mutate: updateStatusMutation } = useUpdate({
		resource: 'orders',
	})

	const {
		selectProps: { options: statusOptions },
	} = useSelect({
		resource: 'orders/statuses',
		optionLabel: 'status',
		optionValue: 'status',
	})
	const filterByStatus = (status: string) => {
		setFilters({
			...defaultFilters,
			status,
		})
	}

	const filterByUser = (userId: number) => {
		setFilters({
			...defaultFilters,
			userId,
		})
	}

	const filterByAddress = (address: string) => {
		setFilters({
			...defaultFilters,
			address,
		})
	}

	// Đồng bộ dataSource với tableDataSource
	useEffect(() => {
		if (tableDataSource) {
			setDataSource([...tableDataSource]) // Tạo bản sao
		}
	}, [tableDataSource])

	// Lọc dữ liệu thủ công
	useEffect(() => {
		if (!tableDataSource) return
		let filteredData = [...tableDataSource] // Tạo bản sao để lọc
		if (filters.status) {
			filteredData = filteredData.filter(order => order.STATUS === filters.status)
		}
		if (filters.userId) {
			filteredData = filteredData.filter(order => order.userId === filters.userId)
		}
		if (filters.address) {
			filteredData = filteredData.filter(order => order.address.toLowerCase().includes(filters.address.toLowerCase()))
		}
		setDataSource(filteredData)
	}, [tableDataSource, filters])

	// Hàm lấy username từ userId
	const getUsername = (userId: number) => {
		const user = usersData?.data.find(user => user.id === userId)
		return user?.username ?? userId
	}

	const updateStatus = (record: BaseRecord, status: string) => {
		updateStatusMutation({
			id: record.id,
			values: {
				status,
			},
		})
	}
	return (
		<List canCreate={false}>
			<Form layout='horizontal' className='grid grid-cols-3 gap-4'>
				<Form.Item label='Status' className='col-span-1'>
					<select name='status' id='' className={SELECT_CLASS_NAME} onChange={e => filterByStatus(e.target.value)}>
						<option value=''>All</option>
						{statusOptions?.map((option: any) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</Form.Item>
				<Form.Item label='User'>
					<select name='userId' id='' className={SELECT_CLASS_NAME} onChange={e => filterByUser(+e.target.value)}>
						<option value={0}>All</option>
						{usersData?.data.map((user: IUser) => (
							<option key={user.id} value={user.id}>
								{user.username}
							</option>
						))}
					</select>
				</Form.Item>
				<Form.Item label='Address'>
					<Input onChange={e => filterByAddress(e.target.value)} />
				</Form.Item>
			</Form>
			<Table {...tableProps} rowKey='id' dataSource={dataSource}>
				<Table.Column
					dataIndex='id'
					title='ID'
					sortDirections={['ascend', 'descend']}
					sorter={(a, b) => a.id - b.id}
					defaultSortOrder={'ascend'}
				/>
				<Table.Column dataIndex='userId' title='User' render={getUsername} />
				<Table.Column
					dataIndex='price'
					title='Price'
					sortDirections={['ascend', 'descend']}
					sorter={(a, b) => a.price - b.price}
				/>
				<Table.Column
					dataIndex='orderDate'
					title='Order date'
					sortDirections={['ascend', 'descend']}
					sorter={(a, b) => moment(a.orderDate).diff(moment(b.orderDate))}
					render={orderDate => moment(orderDate).format('DD/MM/YYYY')}
				/>
				<Table.Column dataIndex='STATUS' title='Status' />
				<Table.Column dataIndex='address' title='Address' />
				<Table.Column
					title='Actions'
					dataIndex='actions'
					render={(_, record: BaseRecord) => (
						<Space>
							<Button
								type='dashed'
								size='small'
								icon={<RollbackOutlined />}
								title='Mark as pending'
								onClick={() => updateStatus(record, 'pending')}></Button>
							<Button
								className='border-yellow-300 text-yellow-300'
								size='small'
								icon={<InboxOutlined />}
								title='Mark as preparing'
								onClick={() => updateStatus(record, 'preparing')}></Button>
							<Button
								className='border-white text-white'
								size='small'
								icon={<CarOutlined />}
								onClick={() => updateStatus(record, 'shipping')}
								title='Mark as shipping'></Button>
							<Button
								className='border-green-300 text-green-300'
								size='small'
								onClick={() => updateStatus(record, 'delivered')}
								icon={<CheckCircleOutlined />}
								title='Mark as delivered'></Button>
							<ShowButton hideText size='small' recordItemId={record.id} title='Check this order' />
							<Button
								onClick={() => {
									updateStatus(record, 'canceled')
								}}
								size='small'
								icon={<CloseCircleOutlined />}
								danger
								title='Cancel this order'
							/>
						</Space>
					)}
				/>
			</Table>
		</List>
	)
}
