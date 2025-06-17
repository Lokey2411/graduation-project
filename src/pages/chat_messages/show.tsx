import { AliwangwangFilled, UserOutlined } from '@ant-design/icons'
import { Show } from '@refinedev/antd'
import { useList } from '@refinedev/core'
import { Button, Typography } from 'antd'
import { Fragment, memo } from 'react'
import { useParams } from 'react-router'

const { Title } = Typography

interface IMessage {
	id: number
	question: string
	answer: string
	sessionId: string
	created_at: string
}

const BotReplyBox = ({ answer }: { answer: string }) => {
	return (
		<div className='self-start  flex items-start gap-2 group animate-fly-in max-w-3/5'>
			<AliwangwangFilled />
			<p className='bg-gray-300 p-2 rounded rounded-tl-none text-black'>{answer}</p>
		</div>
	)
}

const UserMessageBox = memo(({ question, id }: { question: string; id: number }) => {
	return (
		<div className='self-end flex items-start gap-2 group animate-fly-in max-w-3/5'>
			<p className=' bg-red-500 text-white p-2 rounded rounded-tr-none'>{question}</p>
			<Button type='primary' className='size-6! text-2xl! rounded-full! p-0! '>
				<UserOutlined style={{ fontSize: 16 }} />
			</Button>
		</div>
	)
})

export const ChatShow = () => {
	const { id } = useParams()
	const { data: queryResult, isLoading } = useList({
		resource: `chat/${id}`,
	})

	if (!Array.isArray(queryResult?.data)) return <></>
	return (
		<Show isLoading={isLoading}>
			<div className='flex flex-col gap-4'>
				{queryResult.data.map(({ question, answer, id }) => (
					<Fragment key={id}>
						{question && <UserMessageBox question={question} id={id ? +id : 0} />}
						{answer && <BotReplyBox answer={answer} />}
					</Fragment>
				))}
			</div>
		</Show>
	)
}
