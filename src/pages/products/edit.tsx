import { MAX_PRODUCT_IMAGE_COUNT } from '@/commons/constants'
import BooleanField from '@/components/BooleanField'
import DeleteButton from '@/components/DeleteButton'
import { DoubleRightOutlined, FileImageOutlined, SyncOutlined } from '@ant-design/icons'
import { CreateButton, Edit, EditButton, useForm, useSelect } from '@refinedev/antd'
import { BaseRecord, useCreate, useDelete, useList } from '@refinedev/core'
import { axiosInstance } from '@refinedev/simple-rest'
import { Button, Flex, Form, Image, Input, InputNumber, Modal, Select, Space, Switch, Table } from 'antd'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export const ProductEdit = () => {
	const { formProps, saveButtonProps } = useForm({})
	const [modal, setModal] = useState('')
	const [priorities, setPriorities] = useState({} as { [key: number]: number })
	const { selectProps } = useSelect({
		resource: 'categories',
		optionLabel: 'name',
		optionValue: 'id',
		defaultValue: formProps?.form?.getFieldValue('category_id'),
	})
	const { id } = useParams()
	const { data: allProducts } = useList({
		resource: '/products',
	})
	const { data: relatedProducts } = useList({
		resource: `/products/${id}/related-products`,
	})
	const { mutate: addRelatedProductMutation } = useCreate({
		resource: `/products/${id}/related-products`,
		successNotification: { description: 'Success', message: 'Add related product successfully', type: 'success' },
	})
	const { mutate: removeRelatedProductMutation } = useDelete()
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

	useEffect(() => {
		if (allProducts?.data && Array.isArray(allProducts.data)) {
			const newPriorities = {} as { [key: number]: number }
			allProducts.data.forEach(product => {
				const relatedProduct = relatedProducts?.data?.find(rp => rp.id === product.id)
				if (product.id) newPriorities[+product.id] = relatedProduct?.priority ?? -1
			})
			setPriorities(newPriorities)
		}
	}, [allProducts])

	const toggleRelatedProduct = (checked: boolean, id: number) => {
		if (
			checked // NOSONAR
		) {
			addRelatedProductMutation({
				values: {
					related_product_id: id,
					priority: priorities[id],
				},
			})
		} else {
			removeRelatedProductMutation({
				resource: 'products/' + id + '/related-products',
				id,
			})
		}
	}

	return (
		<Edit
			saveButtonProps={saveButtonProps}
			headerButtons={({ defaultButtons }) => {
				return (
					<>
						{defaultButtons}
						<Button type='primary' onClick={() => setModal('related')} icon={<SyncOutlined />}>
							Related products
						</Button>
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
			<Modal open={modal === 'related'} onCancel={() => setModal('')} title='Related products'>
				<div className='grid grid-cols-2 gap-x-3 gap-y-4'>
					{Array.isArray(allProducts?.data) &&
						allProducts.data.map(product => {
							const isRelated = relatedProducts?.data?.some(p => p.id === product.id) // find(p => p.product_id === product.id)
							return (
								<React.Fragment key={product.id ?? 0}>
									<div className='col-span-1 flex gap-2 items-center'>
										<FormItemLabel prefixCls='' label={product.name}></FormItemLabel>
										<Switch
											className='flex-1'
											defaultChecked={isRelated}
											onChange={checked => toggleRelatedProduct(checked, product.id ? +product.id : 0)}
										/>
									</div>
									<div className='flex gap-2 items-center'>
										<FormItemLabel prefixCls='' label='Priority'></FormItemLabel>
										<InputNumber
											disabled={isRelated}
											defaultValue={priorities[product.id ? +product.id : 0] ?? -1}
											onChange={value => (priorities[product.id ? +product.id : 0] = value ?? -1)}
										/>
									</div>
								</React.Fragment>
							)
						})}
				</div>
			</Modal>
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
