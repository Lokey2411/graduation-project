import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { FloatButton } from 'antd';
import { ArrowUpOutlined, CustomerServiceFilled, MessageFilled } from '@ant-design/icons';
export default function LayoutApp() {
	return (
		<>
			<Header />
			<div className=''>
				<Outlet />
			</div>
			<Footer />
			<FloatButton.Group trigger='click' icon={<CustomerServiceFilled />} className='fixed bottom-4 right-4'>
				<FloatButton icon={<MessageFilled />} tooltip='chat' />
				<FloatButton
					tooltip='Back to top'
					icon={<ArrowUpOutlined className='group-hover:animate-bounce' />}
					onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
					className='!bg-secondary-bg group'
				/>
			</FloatButton.Group>
		</>
	);
}
