import { Create, useForm, useSelect } from '@refinedev/antd'
import { useCreate } from '@refinedev/core'
import { Flex, Form, Input, InputNumber, Select } from 'antd'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import { useParams } from 'react-router'

export const VariantCreate = () => {
	const { formProps, saveButtonProps } = useForm({})
	const { id } = useParams()
	const resource = `products/${id}/variants`
	const { mutate: saveData } = useCreate({
		resource,
	})
	const { selectProps } = useSelect({
		resource: 'products',
		optionLabel: 'name',
		optionValue: 'id',
		defaultValue: id ?? 0,
	})
	return (
		<Create saveButtonProps={{ ...saveButtonProps }}>
			<Form
				{...formProps}
				layout='vertical'
				initialValues={{ product_id: id ? +id : 0 }}
				onFinish={values => {
					console.log(values)
					saveData({
						resource,
						values,
					})
				}}>
				<Form.Item label='Name' name={['name']} rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Flex gap={8} align='center'>
					<FormItemLabel label='Price' prefixCls='' />
					<Form.Item name={['price']} style={{ marginBottom: 0, marginTop: 4 }}>
						<InputNumber addonAfter='$' style={{ width: 100 }} />
					</Form.Item>
				</Flex>
				<Form.Item label='Product' name={['product_id']}>
					<Select {...selectProps} disabled />
				</Form.Item>
				<Form.Item label='Type' name={['variantType']}>
					<Input />
				</Form.Item>
			</Form>
		</Create>
	)
}
