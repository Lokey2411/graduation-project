import { loadIndex } from "./vectorIndex.js";
import { embed } from "./embedding.js";

let vectors: number[][] = [];
let qa: string[][] = [];

function cosineSimilarity(a: number[], b: number[]) {
	const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
	const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
	const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
	return dot / (normA * normB);
}

function searchKNN(vectors: number[][], queryVector: number[], k = 3) {
	const similarities = vectors.map((v, i) => ({
		index: i,
		score: cosineSimilarity(v, queryVector),
	}));

	similarities.sort((a, b) => b.score - a.score);

	const neighbors = similarities.slice(0, k).map((item) => item.index);
	const distances = similarities.slice(0, k).map((item) => item.score);
	return { neighbors, distances };
}

export async function initChat() {
	try {
		const data = await loadIndex("/app/storage/vectors"); // Đọc từ /tmp
		console.log("Data from loadIndex:", data);
		if (!data?.vectors || !data?.qa) {
			console.warn("No valid index data. Setting empty index.");
			vectors = [];
			qa = [];
			return;
		}
		vectors = data.vectors.vectors;
		qa = data.qa;
	} catch (error) {
		console.error("Error in initChat:", error);
		vectors = [];
		qa = [];
	}
}

export async function answer(question: string) {
	if (!vectors?.length) {
		throw new Error("Index chưa được init hoặc không có tài liệu để trả lời.");
	}
	const queryEmbedding: number[] = (await embed(question)) as number[];
	const { neighbors } = searchKNN(vectors, queryEmbedding, 3);
	return qa[neighbors[0]][1];
}
