import hierarchicalPkg from "hnswlib-node";
import getCollection from "./config/chroma.config.js";
const { HierarchicalNSW } = hierarchicalPkg;

const DIM = 384;

export async function buildIndex(embeddings: number[][]) {
	return {
		vectors: embeddings,
		serialize() {
			return JSON.stringify(this.vectors);
		},
	};
}

export async function saveIndex(index: any, qa: string[][], collectionName = "qa_collection") {
	try {
		// Chuẩn bị dữ liệu để lưu\
		const ids = qa.map((_, i) => `qa_${i}`);
		const embeddings = index.vectors;
		const metadatas = qa.map(([question, answer]) => ({ question, answer }));
		const documents = qa.map(([question]) => question); // Lưu câu hỏi làm document
		const collection = await getCollection();
		console.log("Lưu vector và metadata vào collection...");
		await collection.delete({ ids });
		await collection.add({
			ids,
			embeddings,
			documents,
			metadatas,
		});
		console.log("Lưu thành công vào ChromaDB, collection:", collectionName);
	} catch (error) {
		console.error("Lỗi khi lưu vào ChromaDB:", error);
		throw error;
	}
}

export async function loadIndex(collectionName = "qa_collection") {
	try {
		console.log("🔌 Kết nối tới ChromaDB...");
		const collection = await getCollection();
		const results = await collection.get({
			limit: 1000,
			include: ["embeddings", "documents", "metadatas"],
		});

		if (!results?.ids || !results.embeddings || !results.metadatas) {
			throw new Error("⚠️ Không tìm thấy tài liệu hoặc dữ liệu không đầy đủ");
		}

		// Gộp và sort theo thứ tự id ban đầu
		const { ids, embeddings, documents, metadatas } = results;

		const sorted = ids
			.map((id, i) => ({
				id,
				embedding: embeddings[i],
				document: documents[i],
				meta: metadatas[i],
			}))
			.sort((a, b) => {
				const nA = parseInt(a.id.replace("qa_", ""));
				const nB = parseInt(b.id.replace("qa_", ""));
				return nA - nB;
			});

		const vectors = sorted.map((item) => item.embedding);
		const qa = sorted.map((item) => [item.meta!.question, item.meta!.answer]);

		// Kiểm tra khớp
		if (vectors.length !== qa.length) {
			console.warn(`⚠️ vectors.length (${vectors.length}) ≠ qa.length (${qa.length})`);
		} else {
			console.log(`✅ Tải dữ liệu thành công: ${vectors.length} QA-pairs`);
		}

		return {
			vectors,
			qa,
			serialize() {
				return JSON.stringify(this.vectors);
			},
		};
	} catch (error) {
		console.error("❌ Lỗi khi tải từ ChromaDB:", error);
		return null;
	}
}
