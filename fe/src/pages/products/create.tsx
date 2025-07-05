import Select from '@/components/Select'
import { Create, useForm, useSelect } from '@refinedev/antd'
import { Flex, Form, Input, InputNumber } from 'antd'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import TextArea from 'antd/es/input/TextArea'

export const ProductCreate = () => {
	const { formProps, saveButtonProps } = useForm({})
	const { selectProps } = useSelect({
		resource: 'categories',
		optionLabel: 'name',
		optionValue: 'id',
		defaultValue: '',
	})
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
					<FormItemLabel label={'Price'} prefixCls=''></FormItemLabel>
					<Form.Item name={['price']} style={{ marginBottom: 0, marginTop: 4 }}>
						<Input style={{ width: 100 }} />
					</Form.Item>
				</Flex>
				<Flex gap={8} align='center'>
					<FormItemLabel label={'Discount'} prefixCls=''></FormItemLabel>
					<Form.Item name={['discount']} style={{ marginBottom: 0, marginTop: 4 }}>
						<InputNumber min={0} max={100} addonAfter='%' style={{ width: 100 }} />
					</Form.Item>
				</Flex>
				<Form.Item label='Price after discount' name='priceAfterDiscount'>
					<Input />
				</Form.Item>
				<Form.Item label='Category' name={['category_id']} rules={[{ required: true }]}>
					<Select selectProps={selectProps} />
				</Form.Item>
				<Flex gap={8} align='center'>
					<FormItemLabel label={'Best sale'} prefixCls=''></FormItemLabel>
					<Form.Item
						label={''}
						name={['isBestSale']}
						style={{
							marginBottom: 0,
							marginTop: 4,
						}}
						valuePropName='checked'>
						<Input type='checkbox' />
					</Form.Item>
				</Flex>
			</Form>
		</Create>
	)
}
