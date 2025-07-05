import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Vercel cho phép ghi file tạm ở đây
const uploadDir = '/tmp/uploaded_documents'

// Tạo thư mục nếu chưa có
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true }) // chỗ này mới ghi được nè
}

const storage = multer.diskStorage({
	destination: uploadDir,
	filename: (req, file, cb) => {
		cb(null, path.extname(file.originalname))
	},
})

const upload = multer({ storage })

export default upload
