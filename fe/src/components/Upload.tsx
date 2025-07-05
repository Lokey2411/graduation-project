import { axiosInstance } from '@refinedev/simple-rest'
import { Flex, Modal, Upload as AntdUpload, UploadProps } from 'antd'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import React, { useEffect, useState } from 'react'
import { Loading3QuartersOutlined } from '@ant-design/icons'

type UploadPropsWithForm = {
	form: any // Instance của Form từ CategoryCreate
	onUploadSuccess?: (url: string) => void // Callback để truyền giá trị lên form cha
} & UploadProps

const Upload = ({ form, onUploadSuccess, ...uploadProps }: UploadPropsWithForm) => {
	const [imageUploaded, setImageUploaded] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (form && onUploadSuccess) {
			console.log('imageUploaded:', imageUploaded)
			onUploadSuccess(imageUploaded) // Gọi callback để cập nhật form cha
		}
	}, [imageUploaded, form, onUploadSuccess])

	const handleUploadChange: UploadProps['onChange'] = e => {
		setLoading(true)
		const formData = new FormData()
		formData.append('image', e.file.originFileObj ?? '')

		axiosInstance
			.post('/services/api/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then(res => {
				setImageUploaded(res.data.file_url ?? '')
			})
			.catch(error => {
				console.error('Upload error:', error)
			})
			.finally(() => setLoading(false))
	}

	return (
		<>
			{loading && (
				<Modal open={loading} footer={null} closable={false} onCancel={() => setLoading(false)} centered>
					<Loading3QuartersOutlined spin style={{ fontSize: 48, margin: 'auto', display: 'block' }} />
				</Modal>
			)}
			<Flex vertical gap={8}>
				<FormItemLabel prefixCls='text-2xl font-bold' label={'Image'} />
				<AntdUpload
					isImageUrl={() => true}
					accept='image/*'
					maxCount={1}
					listType='picture'
					style={{ width: '100%' }}
					rootClassName='w-full'
					{...uploadProps}
					onChange={handleUploadChange}>
					<div className=''>Click or drag file to this area to upload</div>
				</AntdUpload>
			</Flex>
		</>
	)
}

export default Upload
