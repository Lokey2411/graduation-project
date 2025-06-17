import {
	chatWithBot,
	getAllMessages,
	getMessageByUserOrSession,
	removeMessage,
} from '@/controller/users/chat_messages.controller'
import { asyncHandler } from '@/middleware/asyncHandler'
import { requireAdmin, requireLogin } from '@/middleware/authMiddleware'
import { Router } from 'express'
const chatRouter = Router()

chatRouter.get('/', requireLogin, requireAdmin, asyncHandler(getAllMessages))
chatRouter.get('/:id', requireLogin, requireAdmin, asyncHandler(getMessageByUserOrSession))
chatRouter.post('/', asyncHandler(chatWithBot))
chatRouter.delete('/:id', asyncHandler(removeMessage))

export default chatRouter
