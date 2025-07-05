import Select from '@/components/Select'
import { IUser } from '@/types/IUser'
import {
	CarOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	DollarCircleFilled,
	FilePdfOutlined,
	InboxOutlined,
	Loading3QuartersOutlined,
	RollbackOutlined,
} from '@ant-design/icons'
import { List, ShowButton, useSelect, useTable } from '@refinedev/antd'
import { useUpdate, type BaseRecord } from '@refinedev/core'
import { Button, DatePicker, Form, Input, Space, Statistic, Table } from 'antd'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'

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
	const statistics = useMemo(() => {
		const revenue = dataSource.reduce((total, order) => total + (order.price ? +order.price : 0), 0)
		return {
			Total: { value: dataSource.length, icon: <FilePdfOutlined /> },
			Revenue: {
				value: revenue.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}),
				icon: <DollarCircleFilled className='text-green-500' />,
			},
			Pending: {
				value: tableDataSource?.filter(order => order.STATUS === 'pending').length ?? 0,
				icon: <Loading3QuartersOutlined className='text-yellow-500' />,
			},
			Preparing: {
				value: tableDataSource?.filter(order => order.STATUS === 'preparing').length ?? 0,
				icon: <InboxOutlined />,
			},
			Shipping: {
				value: tableDataSource?.filter(order => order.STATUS === 'shipping').length ?? 0,
				icon: <CarOutlined className='text-blue-500' />,
			},
			Delivered: {
				value: tableDataSource?.filter(order => order.STATUS === 'delivered').length ?? 0,
				icon: <CheckCircleOutlined className='text-green-500' />,
			},
			Canceled: {
				value: tableDataSource?.filter(order => order.STATUS === 'canceled').length ?? 0,
				icon: <CloseCircleOutlined className='text-red-500' />,
			},
		}
	}, [dataSource, tableDataSource])

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
			<div className='grid grid-cols-5 gap-x-5 gap-y-3 rounded-md p-5 shadow-md bg-white dark:bg-slate-500 mb-8'>
				{Object.entries(statistics).map(([key, value]) => (
					<Statistic
						key={key}
						title={key}
						value={value.value}
						className='flex items-center gap-3 flex-col shadow-md rounded-md p-3 bg-slate-600 text-white overflow-ellipsis overflow-hidden whitespace-nowrap'
						valueRender={val => (
							<div className='flex items-center gap-2'>
								{value.icon}
								<span className='text-2xl font-bold'>{val}</span>
							</div>
						)}
					/>
				))}
			</div>
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
				<div className='col-span-2'></div>
				<Form.Item className='col-span-1'>
					<DatePicker.RangePicker
						className='w-full relative'
						getPopupContainer={trigger => trigger.parentElement || trigger}
						picker='date'
						format={'DD/MM/YYYY'}
						dropdownClassName='!top-full !left-0 absolute'
						onChange={(value, info) => {
							const [start, end] = info
							if (start && end) {
								const startDate = new Date(start).toISOString()
								const endDate = new Date(end).toISOString()
								setDataSource(prevData =>
									prevData.filter(order => moment(order.orderDate).isBetween(startDate, endDate, undefined, '[]')),
								)
							} else {
								setDataSource(tableDataSource ? [...tableDataSource] : [])
							}
						}}
						placeholder={['Start date', 'End date']}
					/>
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
