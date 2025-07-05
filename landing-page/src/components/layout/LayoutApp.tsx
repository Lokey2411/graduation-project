import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Button, FloatButton, Form, Input } from 'antd';
import {
	AliwangwangOutlined,
	CloseOutlined,
	CustomerServiceFilled,
	MessageFilled,
	SendOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useApi } from '@/context/ApiContext';
import ChatContainer from './ChatContainer';
export default function LayoutApp() {
	const [chatVisible, setChatVisible] = useState(false);
	const { sessionId, handleAddChatMessage, chatMessages } = useApi();
	const [form] = Form.useForm();
	const handleSendMessage = ({ question }: { question: string }) => {
		handleAddChatMessage({ question, sessionId, answer: '', created_at: Date.now().toString(), id: 0 });
	};
	return (
		<>
			<Header />
			<div className=''>
				<Outlet />
			</div>
			<Footer />
			<FloatButton.Group trigger='click' icon={<CustomerServiceFilled />} placement='top'>
				<FloatButton.BackTop tooltip='Back to top' />
				<FloatButton
					icon={<MessageFilled />}
					tooltip='chat'
					onClick={() => {
						setChatVisible(!chatVisible);
					}}
				/>
				{chatVisible && (
					<div className='fixed right-20 bottom-32 rounded-2xl bg-white z-10 shadow-2xl rounded-br-none animate-fly-in w-1/2 overflow-hidden top-20 flex flex-col'>
						{/* chat header */}
						<div className='flex justify-between items-center p-4 border-b border-gray-500'>
							<div className='flex items-center gap-2 text-lg font-semibold'>
								<circle className='border border-black size-6 rounded-full grid place-items-center'>
									<AliwangwangOutlined />
								</circle>
								<h1 className='text-black font-semibold'>Chat with our chatbot</h1>
							</div>
							<Button
								type='text'
								icon={<CloseOutlined />}
								shape='circle'
								onClick={() => setChatVisible(false)}
								title='Close'></Button>
						</div>

						{/* chat container */}
						<ChatContainer key={JSON.stringify(chatMessages)} form={form} />
						<div className='flex flex-col gap-4 flex-1 '>
							<Form form={form} onFinish={handleSendMessage}>
								<Form.Item name='question' style={{ marginBottom: 0 }}>
									<Input
										placeholder='Type your message here'
										className=' w-full! rounded-t-none! rounded-2xl!'
										allowClear
										suffix={<Button type='primary' icon={<SendOutlined />} htmlType='submit' />}
									/>
								</Form.Item>
							</Form>
						</div>
					</div>
				)}
			</FloatButton.Group>
		</>
	);
}
