import express, { Request, Response } from 'express'
import routers from '@/router'
import { PREFIX_PATH, STATUS } from './constants'
import bodyParser from 'body-parser'
import cloudinaryConfig from './config/cloudinary.config'
import { requireAdmin, requireLogin } from './middleware/authMiddleware'
import { refreshToken } from './utils/controller/refreshToken'
import { asyncHandler } from './middleware/asyncHandler'
import { getAllPermissions } from './controller/users/permissions.controller'
import fs from 'fs'
import upload from './config/upload.config'
const app = express()
app.use(bodyParser.json())

const uploadHandler = (req: any, res: Response) => {
	try {
		if (!req.file) {
			res.status(STATUS.BAD_REQUEST).json({ error: 'No file uploaded' })
			return
		}
		if (!req.file.mimetype.startsWith('image/')) {
			res.status(STATUS.BAD_REQUEST).json({ error: 'Invalid file type' })
			return
		}
		res.json({ file_url: req.file.path })
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : JSON.stringify(error, null, 2)
		res.status(500).json({ error: errorMessage })
	}
}

app.post(PREFIX_PATH + '/upload', cloudinaryConfig, uploadHandler)
app.post(PREFIX_PATH + '/check-token', requireLogin, (req: Request, res: Response) => {
	res.status(STATUS.OK).json('Token is valid')
})

app.post(PREFIX_PATH + '/refresh-token', async (req: Request, res: Response) => {
	const userToken = req.headers.authorization?.split(' ')[1]
	const token = await refreshToken(userToken)
	res.status(STATUS.OK).json({ token })
})

app.get(PREFIX_PATH + '/permissions', requireLogin, requireAdmin, asyncHandler(getAllPermissions))

app.post(PREFIX_PATH + '/files', upload.single('document'), (req: Request, res: Response) => {
	if (!req.file) {
		res.status(400).send('No file uploaded')
		return
	}
	res.send({ message: 'File uploaded successfully', filename: req.file.filename })
})

app.get(PREFIX_PATH + '/files', (req, res) => {
	const directoryPath = './uploaded_documents/'
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			return res.status(500).send('Unable to scan directory')
		}
		const fileList = files.filter(file => file.endsWith('.txt') || file.endsWith('.docx'))
		res.json(
			fileList.map(item => ({
				name: item,
				url: `${PREFIX_PATH}/files/${item}`,
			})),
		)
	})
})

app.get(PREFIX_PATH + '/files/:filename', (req, res) => {
	const filename = req.params.filename
	const filePath = `./uploaded_documents/${filename}`
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).send('Unable to read file')
		}
		res.send(data)
	})
})

app.delete(PREFIX_PATH + '/files/:filename', (req, res) => {
	const filename = req.params.filename
	const filePath = `./uploaded_documents/${filename}`
	fs.unlink(filePath, err => {
		if (err) {
			return res.status(500).send('Unable to delete file')
		}
		res.send('File deleted successfully')
	})
})

routers.forEach(router => {
	app.use(PREFIX_PATH + router.path, router.router)
})

app.listen(8000, () => {
	console.log('Server running on port 8000')
})
