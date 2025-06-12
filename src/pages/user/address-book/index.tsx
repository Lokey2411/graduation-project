import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';
import { useGet } from '@/hooks/useGet';
import { useNotification } from '@/hooks/useNotification';
import UserService from '@/services/UserService';
import { Button, Card, Checkbox, Form, Input, Modal, Skeleton, Table } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import { useEffect, useMemo, useState } from 'react';

export default function AddressBookPage() {
	const { data: addresses, refetch: refetchAddress } = useGet(UserService.getAddresses);
	const [edited, setEdited] = useState(0);
	const addresEdited = useMemo(() => {
		if (!addresses || !Array.isArray(addresses))
			return {} as { address: string; isPrimaryAddress: boolean; userId: number };
		return addresses.find(address => address.id === edited);
	}, [addresses, edited]);
	const primaryAddressIndex = useMemo(() => {
		if (!addresses || !Array.isArray(addresses)) return -1;
		return addresses.find(address => address.isPrimaryAddress)?.id ?? -1;
	}, [addresses]);
	const [form] = useForm();
	const notification = useNotification();
	useEffect(() => {
		form.setFieldsValue(addresEdited);
	}, [form, addresEdited]);

	if (!addresses || !Array.isArray(addresses)) return <Skeleton active />;
	const openPopup = (id: number) => {
		setEdited(id);
		form.setFieldsValue(addresEdited);
	};
	const closePopup = () => {
		setEdited(0);
		form.resetFields();
	};
	const updateAddress: FormProps['onFinish'] = values => {
		if (edited > 0)
			UserService.updateAddress(edited, values)
				.then(res => {
					if (res.status === 200) {
						refetchAddress().then(() => {
							notification.success({ message: 'Success', description: 'Address updated successfully' });
							closePopup();
						});
					} else {
						notification.error({ message: 'Error', description: res.data });
					}
				})
				.catch(err => notification.error({ message: 'Error', description: err.message }));
		else {
			UserService.addAddress(values)
				.then(res => {
					if (res.status === 200) {
						refetchAddress().then(() => {
							notification.success({ message: 'Success', description: 'Address added successfully' });
							closePopup();
						});
					} else {
						notification.error({ message: 'Error', description: res.data });
					}
				})
				.catch(err => {
					notification.error({ message: 'Error', description: err.message });
				});
		}
	};
	return (
		<Card className='flex-1 shadow-2xl animate-to-left'>
			<h1 className='text-2xl font-medium mb-3 text-secondary-bg-2'>Address Book</h1>
			<Modal open={edited !== 0} onCancel={closePopup} title='Edit address' footer={null}>
				<Form form={form} onFinish={updateAddress}>
					<Form.Item name='address' label='Address'>
						<Input />
					</Form.Item>
					<Form.Item valuePropName='checked' name='isPrimaryAddress' label='Primary'>
						<Checkbox disabled={primaryAddressIndex !== -1 && primaryAddressIndex !== edited} />
					</Form.Item>
					<div className='flex w-full justify-end'>
						<Button type='text' onClick={closePopup}>
							Cancel
						</Button>
						<Button type='primary' className='self-end' htmlType='submit' size='large'>
							Save
						</Button>
					</div>
				</Form>
			</Modal>
			<div className='flex justify-end'>
				<Button type='primary' onClick={() => openPopup(-1)}>
					Add new address
				</Button>
			</div>
			<Table dataSource={addresses} rowKey='id'>
				<Table.Column dataIndex='address' title='Address' />
				<Table.Column
					dataIndex='isPrimaryAddress'
					title='Primary'
					render={isPrimaryAddress => <Checkbox checked={isPrimaryAddress} onChange={refetchAddress} />}
				/>
				<Table.Column
					title='Actions'
					render={(_, record) => (
						<div className='flex gap-2'>
							<EditButton
								handleEdit={() => {
									openPopup(record.id);
								}}
							/>
							<DeleteButton refetch={refetchAddress} id={record.id} resource='users/addresses' />
						</div>
					)}
				/>
			</Table>
		</Card>
	);
}
