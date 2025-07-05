import express, { Request, Response } from "express";
import { answer as getAnswer, initChat } from "./chat.js";
import { initEmbedder, embed } from "./embedding.js";
import { buildIndex, saveIndex } from "./vectorIndex.js";
import { parseDocuments } from "./parseDocuments.js";
import upload from "./config/upload.js";
import fs from "fs";
import path from "path";
import { STATUS } from "./STATUS.js";
const app = express();
app.use(express.json());

const UPLOAD_DIR = "/app/storage/uploaded_documents";
const PREFIX_PATH = "/services/api";

const STORAGE_DIR = "/app/storage/uploaded_documents";
const VECTOR_PATH = "/app/storage/vectors";

async function rebuildIndex() {
	try {
		console.log("Rebuilding index...");
		const qa = await parseDocuments(STORAGE_DIR);
		console.log("Parsed QA pairs:", qa);
		if (!qa.length) {
			console.warn("No valid QA pairs. Index sẽ rỗng.");
			return;
		}
		const embs = (await Promise.all(qa.map((q) => embed(q[0])))) as number[][];
		console.log("Embeddings:", embs.length);
		const idx = await buildIndex(embs);
		await saveIndex(idx, qa, VECTOR_PATH);
		await initChat();
		console.log("Index rebuilt");
	} catch (error) {
		console.error("rebuildIndex error:", error);
		throw error;
	}
}

async function loadModel() {
	try {
		console.log("Starting loadModel...");
		await fs.promises.mkdir(STORAGE_DIR, { recursive: true });
		const files = await fs.promises.readdir(STORAGE_DIR);
		if (!files.length) {
			console.log("No documents. Tạo file mẫu...");
			await fs.promises.writeFile(
				path.join(STORAGE_DIR, "/sample.txt"),
				"Câu hỏi: Đây là gì?\nCâu trả lời: Đây là tài liệu mẫu.\n"
			);
			console.log("File mẫu created");
		}
		await initEmbedder();
		const qa = await parseDocuments(STORAGE_DIR);
		console.log("Parsed QA pairs:", qa);
		if (!qa.length) {
			console.warn("No valid QA pairs. Index sẽ rỗng.");
			return;
		}
		const embs = (await Promise.all(qa.map((q) => embed(q[0])))) as number[][];
		console.log("Embeddings:", embs.length);
		const idx = await buildIndex(embs);
		await saveIndex(idx, qa, VECTOR_PATH);
		await initChat();
		console.log("loadModel completed");
	} catch (error) {
		console.error("loadModel error:", error);
		throw error;
	}
}

app.post(PREFIX_PATH + "/files", upload.single("document"), async (req: Request, res: Response) => {
	if (!req.file) {
		res.status(400).send("No file uploaded");
		return;
	}
	await rebuildIndex(); // Tải lại mô hình sau khi upload file mới
	res.send({ message: "File uploaded successfully", filename: req.file.filename });
});

// Endpoint liệt kê file
app.get(PREFIX_PATH + "/files", async (req, res) => {
	try {
		const files = await fs.promises.readdir(UPLOAD_DIR);
		const fileList = files.filter((file) => file.endsWith(".txt") || file.endsWith(".docx"));
		res.json(
			fileList.map((item) => ({
				name: item,
				url: `${PREFIX_PATH}/files/${item}`,
			}))
		);
	} catch (err) {
		console.error("Error scanning directory:", err);
		res.status(STATUS.INTERNAL_SERVER_ERROR).send("Unable to scan directory");
	}
});

// Endpoint đọc file
app.get(PREFIX_PATH + "/files/:filename", async (req, res) => {
	const filename = req.params.filename;
	const filePath = path.join(UPLOAD_DIR, filename);
	try {
		await fs.promises.access(filePath);
		const data = await fs.promises.readFile(filePath, "utf8");
		console.log(`File ${filename} read successfully`);
		res.send(data);
	} catch (err: any) {
		console.error("Error reading file:", err);
		if (err.code === "ENOENT") {
			res.status(STATUS.NOT_FOUND).send("File not found");
		} else {
			res.status(STATUS.INTERNAL_SERVER_ERROR).send("Unable to read file");
		}
	}
});

// Endpoint xóa file
app.delete(PREFIX_PATH + "/files/:filename", async (req, res) => {
	const filename = req.params.filename;
	const filePath = path.join(UPLOAD_DIR, filename);
	try {
		await fs.promises.access(filePath);
		await fs.promises.unlink(filePath);
		console.log(`File ${filename} deleted successfully`);
		res.send("File deleted successfully");
	} catch (err: any) {
		console.error("Error deleting file:", err.message, err.stack);
		if (err.code === "ENOENT") {
			res.status(STATUS.NOT_FOUND).send("File not found");
		} else {
			res.status(STATUS.INTERNAL_SERVER_ERROR).send("Unable to delete file");
		}
	}
});

app.post("/services/api/chat", async (req, res) => {
	const { question } = req.body;
	if (!question) {
		res.status(400).json({ error: "Câu hỏi không được để trống." });
		return;
	}
	try {
		const answer = await getAnswer(question);
		res.status(200).json({ answer });
	} catch (error: any) {
		console.error("Chat error:", error);
		if (error.message.includes("Index chưa được init")) {
			res.status(400).json({
				error: "Chưa có tài liệu để trả lời. Vui lòng upload tài liệu trước.",
			});
		} else {
			res.status(500).json({ error: "Lỗi server" });
		}
	}
});
loadModel()
	.then(() => {
		app.listen(5000, "0.0.0.0", () => {
			console.log("Chatbot server is running on port 5000");
		});
	})
	.catch((err) => {
		console.error("Failed to initialize chatbot:", err);
	});
export default app;
