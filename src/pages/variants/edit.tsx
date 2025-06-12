import { DoubleLeftOutlined } from '@ant-design/icons'
import { Edit, useForm, useSelect } from '@refinedev/antd'
import { Button, Flex, Form, Input, InputNumber, Select } from 'antd'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import { useParams } from 'react-router'

type VariantEditHeaderButtonsProps = {
	defaultButtons: React.ReactNode
	id: string | undefined
}

const VariantEditHeaderButtons: React.FC<VariantEditHeaderButtonsProps> = ({ defaultButtons, id }) => (
	<>
		{defaultButtons}
		<Button type='primary' href={`/products/edit/${id}`} icon={<DoubleLeftOutlined />}>
			Product
		</Button>
	</>
)
const EditHeaderButtons: React.FC<{ defaultButtons: React.ReactNode }> = function ({ defaultButtons }) {
	const { id } = useParams()
	return <VariantEditHeaderButtons defaultButtons={defaultButtons} id={id} />
}

export const VariantEdit = () => {
	const { id, variant_id } = useParams()
	const resource = id ? `products/${id}/variants` : 'products'

	// Kiểm tra id và variant_id
	const { formProps, saveButtonProps } = useForm({
		resource,
		id: variant_id ?? 0,
		action: 'edit',
	})
	const { selectProps } = useSelect({
		resource: 'products',
		optionLabel: 'name',
		optionValue: 'id',
		defaultValue: id ?? 0,
	})

	// Debug
	if (!id || !variant_id) {
		return <div>Error: Missing product ID or variant ID</div>
	}
	return (
		<Edit saveButtonProps={saveButtonProps} headerButtons={EditHeaderButtons}>
			<Form {...formProps} layout='vertical'>
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
		</Edit>
	)
}
