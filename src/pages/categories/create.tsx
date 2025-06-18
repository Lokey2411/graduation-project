import Upload from '@/components/Upload'
import { Create, useForm } from '@refinedev/antd'
import { Flex, Form, Input } from 'antd'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import TextArea from 'antd/es/input/TextArea'
import { useState } from 'react'

export const CategoryCreate = () => {
	const { formProps, saveButtonProps } = useForm({})
	const [image, setImage] = useState('')
	const handleUploadSuccess = (url: string) => {
		formProps.form?.setFieldsValue({ image_url: url }) // Cập nhật field image trong form;
		setImage(url)
		console.log('Form image updated:', url)
	}
	return (
		<Create saveButtonProps={saveButtonProps}>
			<Form {...formProps} layout='vertical'>
				<Form.Item
					label={'Name'}
					name={['name']}
					rules={[
						{
							required: true,
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					label={'Description'}
					name={['description']}
					rules={[
						{
							required: true,
						},
					]}>
					<TextArea />
				</Form.Item>
				<Flex gap={8} align='center'>
					<FormItemLabel label={'Is New Arrival'} prefixCls=''></FormItemLabel>
					<Form.Item
						label={''}
						name={['isNewArrival']}
						style={{
							marginBottom: 0,
							marginTop: 4,
						}}
						valuePropName='checked'>
						<Input type='checkbox' defaultChecked={false} />
					</Form.Item>
				</Flex>
				<Upload form={formProps.form} onUploadSuccess={handleUploadSuccess} />
				<Form.Item label={'Image'} name={['image_url']}>
					<Input value={image} />
				</Form.Item>
			</Form>
		</Create>
	)
}
