import BooleanField from '@/components/BooleanField'
import { Show, TextField } from '@refinedev/antd'
import { useShow } from '@refinedev/core'
import { Image, Typography } from 'antd'

const { Title } = Typography

export const CategoryShow = () => {
	const { queryResult } = useShow({})
	const { data, isLoading } = queryResult

	const record = data?.data

	return (
		<Show isLoading={isLoading}>
			<Title level={5}>{'ID'}</Title>
			<TextField value={record?.id} />
			<Title level={5}>{'Name'}</Title>
			<TextField value={record?.name} />
			<Title level={5}>{'Description'}</Title>
			<TextField value={record?.description} />
			<Title level={5}>{'New Arrival'}</Title>
			<BooleanField value={record?.isNewArrival} className='' />
			<Title level={5}>{'Image'}</Title>
			<Image width={200} src={record?.image_url} />
		</Show>
	)
}
