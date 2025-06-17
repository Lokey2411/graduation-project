import { useApi } from '@/context/ApiContext';
import { AliwangwangFilled, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Button, FormProps, Modal } from 'antd';
import { Fragment } from 'react/jsx-runtime';
import { memo, useEffect, useRef, useState } from 'react';
import TypingIndicator from '../TypingIndicator';

const BotReplyBox = ({ answer }: { answer: string }) => {
	return (
		<div className='self-start  flex items-start gap-2 group animate-fly-in max-w-3/5'>
			<AliwangwangFilled />
			<p className='bg-gray-300 p-2 rounded rounded-tl-none'>{answer}</p>
		</div>
	);
};

const UserMessageBox = memo(({ question, id }: { question: string; id: number }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const { handleRemoveMessage } = useApi();
	return (
		<>
			<Modal
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
				onOk={() => {
					handleRemoveMessage({ id, question, answer: '', created_at: '', sessionId: '' });
				}}>
				<p>Are you sure you want to delete this message?</p>
			</Modal>
			<div className='self-end flex items-start gap-2 group animate-fly-in max-w-3/5'>
				{!!id && (
					<div className='hidden! group-hover:inline-flex!'>
						<Button
							type='default'
							onClick={() => {
								setModalOpen(true);
							}}
							icon={<DeleteOutlined />}
							danger
						/>
					</div>
				)}
				<p className=' bg-secondary-bg-2 text-white p-2 rounded rounded-tr-none'>{question}</p>
				<Button type='primary' className='size-6! text-2xl! rounded-full! p-0! '>
					<UserOutlined style={{ fontSize: 16 }} />
				</Button>
			</div>
		</>
	);
});

const TypingBox = () => (
	<TypingIndicator
		className='self-start  flex items-start gap-2 group '
		textClassname='bg-gray-300 p-2 rounded rounded-tl-none w-full! h-auto!'
	/>
);

export default function ChatContainer({ form }: { readonly form: FormProps['form'] }) {
	const { chatMessages, isMessaging } = useApi();
	const chatContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		form?.setFieldValue('question', '');
	}, [chatMessages]);
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({
				top: chatContainerRef.current.scrollHeight,
			});
		}
	}, [chatMessages, isMessaging]);
	return (
		<div className='flex flex-col gap-4 p-4 h-full overflow-auto' ref={chatContainerRef}>
			{chatMessages.map(({ answer, id, question }) => (
				<Fragment key={id}>
					{question && <UserMessageBox question={question} id={id} />}
					{answer ? <BotReplyBox answer={answer} /> : <TypingBox />}
				</Fragment>
			))}
			{isMessaging && (
				<>
					<UserMessageBox question={form?.getFieldValue('question')} id={0} />
					<TypingBox />
				</>
			)}
		</div>
	);
}
