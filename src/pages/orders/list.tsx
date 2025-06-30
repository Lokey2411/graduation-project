import Select from '@/components/Select'
import { IUser } from '@/types/IUser'
import {
	CarOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	InboxOutlined,
	RollbackOutlined,
} from '@ant-design/icons'
import { List, ShowButton, useSelect, useTable } from '@refinedev/antd'
import { useUpdate, type BaseRecord } from '@refinedev/core'
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

	const { selectProps: userSelectProps } = useSelect<IUser>({
		resource: 'users',
		optionLabel: 'username',
		optionValue: 'id',
	})

	const { mutate: updateStatusMutation } = useUpdate({
		resource: 'orders',
	})

	const { selectProps } = useSelect({
		resource: 'orders/statuses',
		optionLabel: 'status',
		optionValue: 'status',
	})
	const filterByStatus = (status: string) => {
		setFilters(
			status
				? {
						...defaultFilters,
						status,
				  }
				: defaultFilters,
		)
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
		const user = userSelectProps?.options?.find(user => user.value === userId)
		return user?.label ?? userId
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
					<Select
						selectProps={selectProps}
						onChange={value => filterByStatus(value?.toString())}
						allowClear
						placeholder='Select status'
					/>
				</Form.Item>
				<Form.Item label='User'>
					<Select
						selectProps={userSelectProps}
						allowClear
						placeholder='Select user'
						onChange={value => filterByUser(value ? +value : 0)}
					/>
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
								className=' dark:border-blue-300 dark:text-blue-300'
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
