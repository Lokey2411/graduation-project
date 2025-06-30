import Upload from '@/components/Upload'
import { Edit, useForm } from '@refinedev/antd'
import { useOne, useResourceParams } from '@refinedev/core'
import { Flex, Form, Image, Input } from 'antd'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import TextArea from 'antd/es/input/TextArea'
import { useParams } from 'react-router'

export const CategoryEdit = () => {
	const { id } = useParams<{ id: string }>()
	const { resource } = useResourceParams()
	const { formProps, saveButtonProps } = useForm({})
	const { data: category } = useOne({
		resource: resource?.name,
		id,
	})

	const handleUploadSuccess = (url: string) => {
		if (url) formProps.form?.setFieldValue('image_url', url)
		console.log('Form image updated:', url)
	}

	return (
		<Edit saveButtonProps={saveButtonProps}>
			<Form {...formProps} layout='vertical'>
				<Form.Item label={'Name'} name={['name']} rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item label={'Description'} name={['description']} rules={[{ required: true }]}>
					<TextArea />
				</Form.Item>
				<Flex gap={8} align='center'>
					<FormItemLabel label={'Is New Arrival'} prefixCls=''></FormItemLabel>
					<Form.Item
						label={''}
						name={['isNewArrival']}
						style={{ marginBottom: 0, marginTop: 4 }}
						valuePropName='checked'>
						<Input type='checkbox' />
					</Form.Item>
				</Flex>
				<Upload form={formProps.form} onUploadSuccess={handleUploadSuccess} />
				{category?.data?.image_url && <Image src={category?.data.image_url} width={200} height={200} />}
				<Form.Item label={'Image'} name={['image_url']}>
					<Input />
				</Form.Item>
			</Form>
		</Edit>
	)
}
