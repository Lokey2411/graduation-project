import multer from "multer";
import fs from "fs";

const uploadDir = "/app/storage/uploaded_documents";

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: uploadDir,
	filename: (req, file, cb) => {
		cb(null, Date.now() + "_" + file.originalname);
	},
});

const upload = multer({ storage });

export default upload;
