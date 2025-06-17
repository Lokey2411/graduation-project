import { STATUS } from '@/constants'
import { Request, Response } from 'express'
import { spawn } from 'child_process'
import fs from 'fs'
import connection from '@/config/db'
import { deleteData } from '@/utils/controller/deleteData'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/config/env'

export const getAllMessages = async (req: Request, res: Response) => {
	try {
		const sql = 'SELECT * FROM chat_messages ORDER BY created_at ASC'
		const [data] = await (await connection).query(sql)
		return res.status(STATUS.OK).json(data)
	} catch (error) {
		console.error('Error fetching message:', error)
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
		const sessionId = req.body?.sessionId
		const sql = `SELECT * FROM chat_messages WHERE (user_id = ? OR sessionId = ?) AND isDelete = false ORDER BY created_at DESC`
		const values = [userId, sessionId]
		const [data] = await (await connection).query(sql, values)
		return res.status(STATUS.OK).json(data)
	} catch (error) {
		console.error('Error when adding message:', error)
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
			res.status(400).send('No question provided')
			return
		}

		// Kiểm tra thư mục
		const directoryPath = './uploaded_documents/'
		if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath, { recursive: true })
			res.status(500).send('Directory created, please upload files first.')
			return
		}

		const pythonProcess = spawn('python', ['chatbot.py', question], {
			env: { ...process.env, PYTHONPATH: './' },
		})

		let output = ''
		pythonProcess.stdin.write(question + '\n')
		pythonProcess.stdin.end()

		pythonProcess.stdout.on('data', data => {
			output += data.toString()
		})

		pythonProcess.stderr.on('data', data => {
			console.error(`Python error: ${data}`)
		})

		pythonProcess.on('close', async code => {
			if (code === 0) {
				const sql = `INSERT INTO chat_messages (user_id, question, answer, sessionId) VALUES (?, ?, ?, ?)`
				const values = [userId ?? null, question, output.trim(), sessionId]
				const [result] = await (await connection).query(sql, values)
				if (result && 'affectedRows' in result && result.affectedRows === 0) {
					// Sửa lỗi chính tả
					return res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal Server Error')
				}
				return res.status(STATUS.OK).json({ answer: output.trim() })
			} else {
				return res.status(STATUS.INTERNAL_SERVER_ERROR).send('Error processing question')
			}
		})
	} catch (error) {
		console.error('Error fetching categories:', error)
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
