import DeleteButton from '@/components/DeleteButton'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { List, useTable } from '@refinedev/antd'
import { useCreate } from '@refinedev/core'
import { Button, Space, Table, Upload } from 'antd'

export const DocumentList = () => {
	const { tableProps } = useTable({
		resource: 'files',
		syncWithLocation: true,
	})

	const { mutate: createDocument } = useCreate()

	return (
		<List
			headerButtons={
				<Upload
					showUploadList={false}
					maxCount={1}
					accept='.txt,.docx'
					beforeUpload={file => {
						const formData = new FormData()
						formData.append('document', file)

						createDocument({
							resource: 'files',
							values: formData,
							meta: {
								headers: {
									'Content-Type': 'multipart/form-data',
								},
							},
						})

						return false // ❗Ngăn không cho antd tự upload
					}}>
					<Button type='primary' icon={<UploadOutlined />}>
						Upload
					</Button>
				</Upload>
			}>
			<Table {...tableProps}>
				<Table.Column dataIndex='name' title={'Name'} />
				<Table.Column
					dataIndex='url'
					render={(url, record) => (
						<Space>
							<Button href={url} shape='circle' title='Download' download>
								<DownloadOutlined />
							</Button>
							<DeleteButton resource='files' id={record.name} />
						</Space>
					)}
					title='Actions'
				/>
			</Table>
		</List>
	)
}
