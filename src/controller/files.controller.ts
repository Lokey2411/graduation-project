import { STATUS } from '@/constants'
import { apiChatbot } from '@/utils/apiChatbot'
import { Request, Response } from 'express'
import fs from 'fs'
import FormData from 'form-data'

export const getAllFiles = async (req: Request, res: Response) => {
	const data = await apiChatbot('/files', 'GET', undefined, {})
	res.status(STATUS.OK).json(data)
}
export const uploadFile = async (req: Request, res: Response) => {
	const file = req.file
	if (!file) {
		return res.status(STATUS.BAD_REQUEST).json({ error: 'File is required' })
	}

	const formData = new FormData()
	formData.append('document', fs.createReadStream(file.path), file.originalname)

	const headers = formData.getHeaders()

	const data = await apiChatbot('/files', 'POST', formData, headers)

	res.status(STATUS.OK).json(data)
}

export const getFileUrl = async (req: Request, res: Response) => {
	const { fileName } = req.params
	const data = await apiChatbot(`/files/${fileName}`, 'GET', undefined, {})
	res.status(STATUS.OK).json(data)
}

export const removeFile = async (req: Request, res: Response) => {
	const { fileName } = req.params
	const data = await apiChatbot(`/files/${fileName}`, 'DELETE', undefined, {})
	res.status(STATUS.OK).json(data)
}
