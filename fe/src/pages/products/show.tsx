import { Show, TextField } from '@refinedev/antd'
import { useShow } from '@refinedev/core'
import { Typography } from 'antd'

const { Title } = Typography

export const ProductShow = () => {
	const { queryResult } = useShow({})
	const { data, isLoading } = queryResult

	const record = data?.data

	return (
		<Show isLoading={isLoading}>
			<Title level={5}>{'ID'}</Title>
			<TextField value={record?.id} />
			<Title level={5}>{'Title'}</Title>
			<TextField value={record?.title} />
		</Show>
	)
}
