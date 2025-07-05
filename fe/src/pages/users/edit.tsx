import { Edit, useForm } from '@refinedev/antd'
import { useCreate, useList } from '@refinedev/core'
import { Form, Input, Switch } from 'antd'
import { useParams } from 'react-router'

export const UserEdit = () => {
	const { formProps } = useForm({})
	const { id } = useParams()
	const resource = `users/${id}`
	const { data: permissions } = useList({ resource: 'permissions' })
	const { mutate: addUserPermission } = useCreate({
		resource: `${resource}/permissions`,
		successNotification: { description: 'Success', message: "Add user's permission successfully", type: 'success' },
	})
	const { mutate: removeUserPermission } = useCreate({
		resource: `${resource}/permissions`,
		successNotification: { description: 'Success', message: "Remove user's permission successfully", type: 'success' },
	})
	const { data: userPermissions } = useList({
		resource: `${resource}/permissions`,
	})

	const addPermission = (values: { user_id: number; permission_id: number }) => {
		addUserPermission({
			values,
		})
	}

	const removePermission = (values: { user_id: number; permission_id: number }) => {
		removeUserPermission({
			values,
		})
	}

	const onSwitchPermission = (isChecked: boolean, record: any) => {
		const values = {
			user_id: id ? +id : 0,
			permission_id: record.id,
		}
		if (isChecked) {
			addPermission(values)
		} else {
			removePermission(values)
		}
	}
	return (
		<Edit
			footerButtons={<></>}
			footerButtonProps={{
				hidden: true,
			}}
			title='Edit User permissions'>
			{Array.isArray(permissions?.data) &&
				permissions.data.map(item => {
					let isChecked = userPermissions?.data.some(userPermission => userPermission.id === item.id)
					return (
						<Form.Item key={item.id}>
							<Switch
								title={item.description}
								onChange={value => {
									onSwitchPermission(value, item)
								}}
								checkedChildren={item.NAME}
								unCheckedChildren={item.NAME}
								defaultChecked={isChecked}></Switch>
						</Form.Item>
					)
				})}
			<Form {...formProps} layout='horizontal' className='grid grid-cols-3 gap-2'>
				<Form.Item name='username' label='Username'>
					<Input disabled />
				</Form.Item>
				<Form.Item name='fullName' label='Full Name'>
					<Input disabled />
				</Form.Item>
				<Form.Item name='email' label='Email'>
					<Input disabled />
				</Form.Item>
			</Form>
		</Edit>
	)
}
