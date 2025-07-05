import { PayCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const CheckoutButton = ({ handleCheckout, disabled }: { handleCheckout?: () => void; disabled?: boolean }) => {
	return (
		<Button
			disabled={disabled}
			className='py-2! group'
			title='Checkout this item'
			type='primary'
			icon={<PayCircleOutlined className='group-hover:animate-bounce' />}
			onClick={handleCheckout}>
			Checkout now
		</Button>
	);
};

export default CheckoutButton;
