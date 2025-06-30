import CheckoutButton from '@/components/CheckoutButton';
import DeleteButton from '@/components/DeleteButton';
import SaveButton from '@/components/SaveButton';
import { useApi } from '@/context/ApiContext';
import { useGet } from '@/hooks/useGet';
import { useOrder } from '@/hooks/useOrder';
import ProductService from '@/services/ProductService';
import UserService from '@/services/UserService';
import { PayCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Divider, Empty, Flex, Image, InputNumber, Modal, QRCode, Table } from 'antd';
import FormItemLabel from 'antd/es/form/FormItemLabel';
import Link from 'antd/es/typography/Link';
import { useEffect, useMemo, useState } from 'react';

const ProductItem = ({ id, name }: { id: number; name: string }) => {
	const { data: images } = useGet(async () => await ProductService.getProductImages(id));
	return (
		<div className='flex gap-2 items-center'>
			<Image
				src={images && Array.isArray(images) ? images[0] : 'https://placehold.co/400'}
				className='size-full object-cover rounded-xl'
				rootClassName='size-10'
				preview={false}
				onError={e => (e.currentTarget.src = 'https://placehold.co/400')}
			/>
			<div className='text-sm'>{name}</div>
		</div>
	);
};

export default function CartPage() {
	const { orders: carts, refetchOrders: refetch } = useApi();
	const { data: addresses } = useGet<any[]>(UserService.getAddresses);
	const [checkout, setCheckout] = useState(false);
	const [quantities, setQuantities] = useState({} as { [id: number]: number });
	const { setOrderPrice, setOrderAddress } = useOrder();
	const disabledCheckout = useMemo(() => {
		return Object.entries(quantities).some(([id, quantity]) => {
			const cartQuantity = carts.find((cart: any) => cart.productOrderId === +id)?.quantity;
			return cartQuantity !== quantity;
		});
	}, [carts, quantities]);
	const [subtotal, setSubtotal] = useState(0);
	useEffect(() => {
		if (carts && Array.isArray(carts)) {
			setQuantities(
				carts.reduce(
					(acc, record) => ({
						...acc,
						[record.productOrderId]: record.quantity,
					}),
					{},
				),
			);
		}
	}, [carts]);
	useEffect(() => {
		if (carts && Array.isArray(carts)) {
			setSubtotal(
				carts.reduce(
					(acc, record) =>
						acc + (+record.orderPrice / record.quantity) * (quantities[record.productOrderId] || record.quantity),
					0,
				),
			);
		}
	}, [carts, quantities]);
	useEffect(() => {
		console.log('Quantities updated', quantities);
	}, [quantities]);
	const primaryAddress = useMemo(
		() => (Array.isArray(addresses) ? addresses.find(address => address.isPrimaryAddress)?.address : ''),
		[addresses],
	);
	const tax = useMemo(() => subtotal * 0.1, [subtotal]);
	const total = useMemo(() => subtotal + tax, [subtotal, tax]);
	useEffect(() => {
		setOrderPrice(total);
	}, [total]);
	if (!carts || !Array.isArray(carts) || carts.length === 0)
		return (
			<div className='mx-app min-h-screen grid place-items-center'>
				<Empty />
			</div>
		);
	const formatNumber = (value: number) => `${value.toFixed(2)}`;

	// Handle quantity change for a specific row
	const handleQuantityChange = (id: number, value: number) => {
		setQuantities(prev => ({
			...prev,
			[id]: value,
		}));
	};

	return (
		<div className='mx-app'>
			<Flex vertical gap={80}>
				<Breadcrumb
					className='animate-to-right'
					items={[
						{
							title: <Link href='/'>Home</Link>,
						},
						{
							title: 'Cart',
						},
					]}
				/>
				<Modal
					open={checkout}
					onCancel={() => setCheckout(false)}
					onOk={() => {
						setOrderPrice(total);
						window.location.href = '/checkout/' + carts[0].orderId;
					}}
					title='Checkout'
					okText='Checkout'
					cancelButtonProps={{ size: 'large', type: 'text' }}
					okButtonProps={{ disabled: disabledCheckout, icon: <PayCircleOutlined />, size: 'large' }}>
					<div className='grid grid-cols-2'>
						<h1 className='text-2xl font-bold col-span-2'>Checkout your cart. Here is some information:</h1>
						<QRCode
							className='col-span-1 m-auto aspect-square'
							value={
								// `https://localhost:3000/checkout/${carts[0].orderId}`
								window.location.origin + '/checkout/' + carts[0].orderId
							}
						/>
						<div className='col-span-1'>
							<div className='flex justify-end gap-3'>
								<p>Subtotal:</p>
								<p className='text-secondary-bg-2'>${formatNumber(subtotal)}</p>
							</div>
							<div className='flex justify-end gap-3'>
								<p>Tax:</p>
								<p className='text-secondary-bg-2'>${formatNumber(tax)}</p>
							</div>
							<div className='flex justify-end gap-3 font-bold text-2xl'>
								<p>Total:</p>
								<p className='text-secondary-bg-2'>${formatNumber(total)}</p>
							</div>
						</div>
						<div className='flex flex-col gap-2 flex-2/3 col-span-2'>
							{carts.map(cart => (
								<div className='flex justify-between' key={cart.productOrderId}>
									<p>
										Product: {cart.name} * {cart.quantity}
									</p>
									<p className='text-secondary-bg-2'>${cart.orderPrice}</p>
								</div>
							))}
							<Divider />
							<FormItemLabel prefixCls='' label='Choose your address' />
							{Array.isArray(addresses) && (
								<div className='relative w-full col-span-2 custom-select'>
									<select
										className=' rounded border border-black'
										defaultValue={primaryAddress}
										onChange={e => setOrderAddress(e.target.value)}>
										{addresses?.map(address => (
											<option key={address.id} value={address.address}>
												{address.address}
											</option>
										))}
									</select>
								</div>
							)}
						</div>
					</div>
				</Modal>
				<Table dataSource={carts} rowKey='productOrderId' key={JSON.stringify(carts)}>
					<Table.Column
						title='Product'
						dataIndex='name'
						render={(name, record) => <ProductItem id={record.product_id} name={name} />}
					/>
					<Table.Column title='Price' dataIndex='price' />
					<Table.Column title='Variant' dataIndex='variantName' />
					<Table.Column
						title='Quantity'
						dataIndex='quantity'
						render={(quantity, record) => (
							<InputNumber
								defaultValue={quantity}
								min={1}
								max={10}
								onChange={value => handleQuantityChange(record.productOrderId, value)}
							/>
						)}
					/>
					<Table.Column
						title='Subtotal'
						dataIndex='orderPrice'
						render={(price, record) =>
							`$${(+price / record.quantity) * (quantities[record.productOrderId] || record.quantity)}`
						}
					/>
					<Table.Column
						title='Actions'
						dataIndex='actions'
						render={(_, record) => (
							<Flex align='center' gap={8}>
								<SaveButton
									refetch={refetch}
									id={record.orderId}
									resources='orders/quantity'
									params={{
										quantity: quantities[+record.productOrderId] ?? record.quantity,
										productOrderId: record.productOrderId,
										price: +(+record.price / record.quantity) * (quantities[record.id] || record.quantity),
									}}
								/>
								<DeleteButton
									refetch={refetch}
									resource='orders'
									id={record.orderId}
									params={{
										body: { product_id: record.product_id },
									}}
								/>
							</Flex>
						)}
					/>
				</Table>
				<div className='flex justify-end '>
					<div className='border border-black w-fit p-4 rounded-2xl shadow-md flex flex-col gap-2'>
						<h1>Checkout this order</h1>
						<div className='flex justify-between'>
							<p>Subtotal: </p>
							<p>${formatNumber(subtotal)}</p>
						</div>
						<div className='flex justify-between'>
							<p>Tax: </p>
							<p>${formatNumber(tax)}</p>
						</div>
						<div className='flex justify-between'>
							<p>Total: </p>
							<p>${formatNumber(total)}</p>
						</div>
						<CheckoutButton
							key={total}
							handleCheckout={() => {
								setCheckout(true);
							}}
							disabled={disabledCheckout}
						/>
					</div>
				</div>
				<div></div>
			</Flex>
		</div>
	);
}
