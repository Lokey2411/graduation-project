import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
	destination: './uploaded_documents/',
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

const upload = multer({ storage: storage })

export default upload
