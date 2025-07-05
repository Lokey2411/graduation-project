import { Show, TextField } from '@refinedev/antd'
import { useList, useShow } from '@refinedev/core'
import { Checkbox, Typography } from 'antd'
import { useParams } from 'react-router'

const { Title } = Typography

export const UserShow = () => {
	const { query: queryResult } = useShow({})
	const { data, isLoading } = queryResult
	const { id } = useParams()
	const record = data?.data
	const { data: permissions } = useList({
		resource: `permissions`,
	})
	const { data: userPermissions } = useList({
		resource: `users/${id}/permissions`,
	})
	return (
		<Show isLoading={isLoading}>
			<div className='grid grid-cols-5 gap-3'>
				<div className='col-span-5 flex gap-3 items-center'>
					<h1 className='text-xl font-bold leading-[100%] h-6'>{'Permissions'}</h1>
					{permissions &&
						Array.isArray(permissions.data) &&
						permissions.data.map((permission: any) => (
							<Checkbox
								style={{
									height: 24,
								}}
								key={permission.id}
								checked={userPermissions?.data?.some((userPermission: any) => userPermission.id === permission.id)}
								disabled>
								{permission.NAME}
							</Checkbox>
						))}
				</div>
				<div>
					<Title level={5}>{'ID'}</Title>
					<TextField value={record?.id} />
				</div>
				<div>
					<Title level={5}>{'User name'}</Title>
					<TextField value={record?.username} />
				</div>
				<div>
					<Title level={5}>{'email'}</Title>
					<TextField value={record?.email} />
				</div>
				<div>
					<Title level={5}>{'Email'}</Title>
					<TextField value={record?.email} />
				</div>
				<div>
					<Title level={5}>{'fullName'}</Title>
					<TextField value={record?.fullName} />
				</div>
			</div>
		</Show>
	)
}
