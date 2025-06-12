import { MAX_PRODUCT_IMAGE_COUNT } from '@/commons/constants'
import BooleanField from '@/components/BooleanField'
import DeleteButton from '@/components/DeleteButton'
import { DoubleRightOutlined, FileImageOutlined } from '@ant-design/icons'
import { CreateButton, Edit, EditButton, useForm, useSelect } from '@refinedev/antd'
import { BaseRecord } from '@refinedev/core'
import { axiosInstance } from '@refinedev/simple-rest'
import { Button, Flex, Form, Image, Input, InputNumber, Modal, Select, Space, Table } from 'antd'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export const ProductEdit = () => {
	const { formProps, saveButtonProps } = useForm({})
	const [modal, setModal] = useState('')
	const { selectProps } = useSelect({
		resource: 'categories',
		optionLabel: 'name',
		optionValue: 'id',
		defaultValue: formProps?.form?.getFieldValue('category_id'),
	})
	const { id } = useParams()
	const [variants, setVariants] = useState([])
	const [images, setImages] = useState<string[]>([])
	useEffect(() => {
		axiosInstance.get('/services/api/products/' + id + '/variants').then(res => {
			setVariants(res.data)
		})
		axiosInstance.get('/services/api/products/' + id + '/images').then(res => {
			setImages(res.data)
		})
	}, [])
	return (
		<Edit
			saveButtonProps={saveButtonProps}
			headerButtons={({ defaultButtons }) => {
				return (
					<>
						{defaultButtons}
						<Button
							type='primary'
							onClick={() => {
								setModal('image')
							}}
							icon={<FileImageOutlined />}>
							Image
						</Button>
						<Button type='primary' onClick={() => setModal('variant')} icon={<DoubleRightOutlined />}>
							Variant
						</Button>
					</>
				)
			}}>
			<Modal open={modal === 'image'} onCancel={() => setModal('')} title='Image'>
				<div className='flex justify-end items-center my-2 gap-4'>
					{/* length */}
					<p className='text-md font-bold'>
						{images.length}/${MAX_PRODUCT_IMAGE_COUNT}
					</p>
					<CreateButton
						href={'/products/' + id + '/images/create'}
						size='large'
						disabled={images.length >= MAX_PRODUCT_IMAGE_COUNT}
						onClick={() => {
							window.location.href = '/products/' + id + '/images/create'
						}}
					/>
				</div>
				<Table dataSource={images} rowKey='id' pagination={false}>
					<Table.Column dataIndex='id' title='Id' />
					<Table.Column dataIndex='imageUrl' title='imageUrl' render={url => <Image src={url} preview={false} />} />
					<Table.Column
						dataIndex='isPrimaryImage'
						title='Primary'
						render={isPrimaryImage => <BooleanField className='' value={!!isPrimaryImage} />}
					/>
					<Table.Column
						title='Actions'
						render={(_, record: BaseRecord) => (
							<Space>
								<DeleteButton id={record.id!} resource={'products/' + id + '/images'} />
							</Space>
						)}
					/>
				</Table>
			</Modal>
			<Modal open={modal === 'variant'} onCancel={() => setModal('')} title='Variant'>
				<div className='flex justify-end mt-2'>
					<CreateButton
						href={'/products/' + id + '/variants/create'}
						size='large'
						onClick={() => {
							window.location.href = '/products/' + id + '/variants/create'
						}}
					/>
				</div>
				<Table dataSource={variants} rowKey='id' pagination={false}>
					<Table.Column dataIndex='name' title='Name' />
					<Table.Column dataIndex='price' title='Price' />
					<Table.Column dataIndex='variantType' title='Type' />
					<Table.Column
						title='Actions'
						render={(_, record: BaseRecord) => (
							<Space>
								<EditButton
									hideText
									size='small'
									recordItemId={record.id}
									href={'/products/' + id + '/variants/edit/' + record.id}
								/>
								<DeleteButton id={record.id!} resource={'products/' + id + '/variants'} />
							</Space>
						)}
					/>
				</Table>
			</Modal>
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
				<Form.Item label='Category' name={['category_id']}>
					<Select {...selectProps} />
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
		</Edit>
	)
}
