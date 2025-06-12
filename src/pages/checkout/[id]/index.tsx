import React, { useEffect, useState } from 'react';
import { Button, Result, ResultProps } from 'antd';
import { useParams } from 'react-router-dom';
import makeRequest from '@/services/makeRequest';
import { useOrder } from '@/hooks/useOrder';

const CheckoutPage: React.FC = () => {
	const { id } = useParams();
	type Result = {
		status: ResultProps['status'];
		title: ResultProps['title'];
		subTitle: ResultProps['subTitle'];
		extra: ResultProps['extra'];
	};
	const { orderPrice: price, orderAddress: address } = useOrder();
	const [result, setResult] = useState<Result>({
		status: 'info',
		title: 'Waiting for server configuration',
		subTitle: `Order number:${id}  Cloud server configuration takes 1-5 minutes, please wait.`,
		extra: [],
	});
	const checkoutCart = async () => {
		makeRequest
			.patch('/orders/' + id + '/checkout', { price, address })
			.then(res => {
				if (res.status === 200) {
					setResult({
						status: 'success',
						title: 'Success',
						subTitle: `Order number:${id}  Cloud server configuration takes 1-5 minutes, please wait.`,
						extra: [
							<Button type='primary' key='console' href='/orders'>
								View Order
							</Button>,
						],
					});
				} else {
					setResult({
						status: 'error',
						title: 'Error',
						subTitle: `Order number:${id}  Cloud server configuration takes 1-5 minutes, please wait.`,
						extra: [
							<Button type='primary' key='console' href='/orders'>
								View Order
							</Button>,
						],
					});
				}
			})
			.catch(err => {
				setResult({
					status: 'error',
					title: 'Error: ' + err.message,
					subTitle: `Order number:${id}  Cloud server configuration takes 1-5 minutes, please wait.`,
					extra: [
						<Button type='primary' key='console' href='/orders'>
							View Order
						</Button>,
					],
				});
			});
	};
	useEffect(() => {
		checkoutCart();
	}, [id]);
	return <Result {...result} />;
};

export default CheckoutPage;
