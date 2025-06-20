import { MAX_PRODUCT_IMAGE_COUNT } from '@/commons/constants'
import Upload from '@/components/Upload'
import { Create, useForm, useSelect } from '@refinedev/antd'
import { useCreate, useList } from '@refinedev/core'
import { Checkbox, Form, Input, Select } from 'antd'
import { useMemo } from 'react'
import { useParams } from 'react-router'

export const ImageCreate = () => {
	const { formProps, saveButtonProps } = useForm({})
	const { id } = useParams()
	const resource = `products/${id}/images`
	const { mutate: saveData } = useCreate({
		resource,
		mutationOptions: {
			onSuccess: () => {
				window.location.href = '/products/edit/' + id
			},
		},
	})
	const { data } = useList({
		resource,
	})
	const { selectProps } = useSelect({
		resource: 'products',
		optionLabel: 'name',
		optionValue: 'id',
		defaultValue: id ?? 0,
	})
	const hasPrimaryImage = useMemo(() => {
		if (!data?.data) return false
		return data.data.some(item => item.isPrimaryImage)
	}, [data])

	return (
		<Create saveButtonProps={{ ...saveButtonProps, disabled: (data?.total ?? 0) >= MAX_PRODUCT_IMAGE_COUNT }}>
			<Form
				{...formProps}
				layout='vertical'
				initialValues={{ product_id: id ? +id : 0 }}
				onFinish={values => {
					saveData({
						resource,
						values,
					})
				}}>
				<Form.Item label='Product' name={['product_id']}>
					<Select {...selectProps} disabled />
				</Form.Item>
				<Upload
					form={formProps.form}
					onUploadSuccess={url => {
						formProps.form?.setFieldValue('imageUrl', url)
					}}
				/>
				<Form.Item label='URL Image' name={['imageUrl']}>
					<Input />
				</Form.Item>
				<Form.Item label='Primary image' layout='horizontal' name={['isPrimaryImage']} valuePropName='checked'>
					<Checkbox disabled={hasPrimaryImage} />
				</Form.Item>
			</Form>
		</Create>
	)
}
