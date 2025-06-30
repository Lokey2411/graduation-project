import { STATUS } from '@/constants'
import { Request, Response } from 'express'
import connection from '@/config/db'
import { deleteData } from '@/utils/controller/deleteData'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/config/env'
import { apiChatbot } from '@/utils/apiChatbot'
export const getAllMessages = async (req: Request, res: Response) => {
	try {
		const sql = `
			SELECT 
			MAX(m.id) as id, 
			m.user_id, 
			m.sessionId,
			MAX(m.created_at) as created_at,
			COALESCE(u.username, m.sessionId) AS username,
			m.sessionId,
			COUNT(m.id) AS messageCount,
			MAX(m.created_at) AS lastMessageTime,
			u.email
			FROM 
			chat_messages m 
			LEFT JOIN 
			users u
			ON m.user_id = u.id
			AND u.isDelete = false
			GROUP BY m.user_id, m.sessionId, u.username, u.email
			ORDER BY lastMessageTime ASC
		`
		const [data] = await (await connection).query(sql)
		return res.status(STATUS.OK).json(data)
	} catch (error) {
		console.error('Error fetching message:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getMessageByUserOrSession = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const sql = `SELECT * FROM chat_messages WHERE (user_id = ? OR sessionId = ?) AND isDelete = false ORDER BY created_at ASC`
		const values = [id, id]
		const [data] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(data)
	} catch (error) {
		console.error('Error when fetching message:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const getMessageByUser = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization
		const token = authHeader?.split(' ')[1]
		const decoded = token ? jwt.verify(token.toString(), JWT_SECRET) : { userId: null, username: '' }
		if (decoded) {
			req.user = { userId: decoded.userId, username: decoded.username }
		}
		const userId = req.user?.userId
		const sessionId = req.query?.sessionId
		const sql = `SELECT * FROM chat_messages WHERE (user_id = ? OR sessionId = ?) AND isDelete = false ORDER BY created_at ASC`
		const values = [userId, sessionId]
		const [data] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(data)
	} catch (error) {
		console.error('Error when adding message:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const chatWithBot = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization
		const token = authHeader?.split(' ')[1]
		const decoded = token ? jwt.verify(token.toString(), JWT_SECRET) : { userId: null, username: '' }
		if (decoded) {
			req.user = { userId: decoded.userId, username: decoded.username }
		}
		const userId = req.user?.userId
		const { question, sessionId } = req.body

		if (!question) {
			return res.status(400).send('No question provided')
		}
		const data = await apiChatbot(`/chat`, 'POST', { question }, {})
		if (!data?.answer) {
			return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
		}
		const answer = data.answer
		// Ghi vào DB
		const sql = `INSERT INTO chat_messages (user_id, question, answer, sessionId) VALUES (?, ?, ?, ?)`
		const values = [userId ?? null, question, answer, sessionId]
		const [result] = await (await connection).query(sql, values)

		if (result && 'affectedRows' in result && result.affectedRows === 0) {
			return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Database insert failed')
		}

		return res.status(STATUS.OK).json({ answer })
	} catch (error) {
		console.error('Error during chatWithBot:', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}

export const removeMessage = async (req: Request, res: Response) => {
	try {
		const { message, status } = await deleteData(req, 'chat_messages')
		return res.status(status).json(message)
	} catch (error) {
		console.log('Error when removing message', error)
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
	}
}
