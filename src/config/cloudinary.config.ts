import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from './env'
import { STATUS } from '@/constants'
const DEFAULT_FOLDER_UPLOAD = 'uploads/'

// Không cần cấu hình thủ công vì CLOUDINARY_URL đã được load từ .env
const { v2: cloudinaryV2 } = cloudinary

cloudinaryV2.config({
	secure: true,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	cloud_name: CLOUDINARY_NAME,
})

const storage = new CloudinaryStorage({
	cloudinary: cloudinaryV2,
	params: (req, file) => {
		const { folder } = req.body

		const folderName = DEFAULT_FOLDER_UPLOAD + (folder ?? '')

		const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
		const sanitizedFileName = file.originalname.replace(/\s+/g, '_')
		return {
			public_id: `${folderName}/${timestamp}_${sanitizedFileName}`,
		}
	},
})

// Export middleware multer
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
})

export default (req, res, next) => {
	upload.single('image')(req, res, err => {
		if (err) {
			console.error('[MULTER ERROR]', err)
			return res.status(STATUS.BAD_REQUEST).json({ error: err.message })
		}
		next()
	})
}
