import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { PREFIX_PATH, STATUS } from './constants'
import { requireAdmin, requireLogin } from './middleware/authMiddleware'
import { refreshToken } from './utils/controller/refreshToken'
import { asyncHandler } from './middleware/asyncHandler'
import { getAllPermissions } from './controller/users/permissions.controller'
import routers from '@/router'
import cloudinaryConfig from './config/cloudinary.config'

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

routers.forEach(router => {
	app.use(PREFIX_PATH + router.path, router.router)
})

app.listen(8000, () => {
	console.log('Server running on port 8000')
})
