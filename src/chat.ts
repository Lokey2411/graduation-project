import { loadIndex } from "./vectorIndex.js";
import { embed } from "./embedding.js";

let vectors: number[][] = [];
let qa: string[][] = [];

const fallbackAnswer =
	"Xin lỗi. Hiện tại tôi chưa thể đưa ra câu trả lời phù hợp nhất cho bạn. Vui lòng chọn mục `Liên hệ` trên website để liên hệ với quản trị hệ thống và khiếu nại về tình huống này";

function normalize(vec: number[]): number[] {
	const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
	return vec.map((x) => x / (norm || 1)); // tránh chia 0
}

function cosineSimilarity(a: number[], b: number[]) {
	const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
	const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
	const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
	return dot / (normA * normB);
}

function euclideanDistance(a: number[], b: number[]) {
	return Math.sqrt(a.reduce((sum, ai, i) => sum + (ai - b[i]) * (ai - b[i]), 0));
}
async function test() {
	const v1 = (await embed("Cửa hàng mở cửa chủ nhật không?")) as number[];
	const v2 = (await embed("Cửa hàng mở cửa chủ nhật không?")) as number[];
	console.log("Cosine giống nhau:", cosineSimilarity(v1, v2));
}

function searchKNN(
	vectors: number[][],
	queryVector: number[],
	k = 3,
	alpha = 0.7, // Trọng số cho cosine
	beta = 0.3 // Trọng số cho euclidean
) {
	const scores = vectors.map((v, i) => {
		const cos = cosineSimilarity(v, queryVector);
		const eucl = euclideanDistance(v, queryVector);
		const score = alpha * cos - beta * eucl; // Hybrid score
		return { index: i, score };
	});

	scores.sort((a, b) => b.score - a.score);

	const neighbors = scores.slice(0, k).map((item) => item.index);
	const distances = scores.slice(0, k).map((item) => item.score);
	return { neighbors, distances };
}

export async function initChat() {
	try {
		const data = await loadIndex("/app/storage/vectors");
		if (!data?.vectors || !data?.qa) {
			console.warn("No valid index data. Setting empty index.");
			vectors = [];
			qa = [];
			return;
		}
		vectors = data.vectors.map(normalize);
		qa = data.qa.map((item) => item.map((item) => `${item}`));
		await test();
	} catch (error) {
		console.error("Error in initChat:", error);
		vectors = [];
		qa = [];
	}
}

function searchKNNWithThresholds(
	vectors: number[][],
	queryVector: number[],
	cosineThreshold = 0.8,
	euclideanThreshold = 1.0
) {
	const candidates: { index: number; euclidean: number }[] = [];
	vectors.forEach((v, i) => {
		const cos = cosineSimilarity(v, queryVector);
		if (cos >= cosineThreshold) {
			const eucl = euclideanDistance(v, queryVector);
			if (eucl <= euclideanThreshold) {
				candidates.push({ index: i, euclidean: eucl });
			}
		}
	});

	if (!candidates.length) return { neighbors: [], distances: euclideanThreshold };

	let best = candidates[0];
	for (const i in candidates) {
		if (candidates[i].euclidean < best.euclidean) {
			best = candidates[i];
		}
	}
	return {
		neighbors: [best.index],
		distances: [best.euclidean],
	};
}

export async function answer(question: string) {
	if (!vectors?.length) {
		throw new Error("Index chưa được init hoặc không có tài liệu để trả lời.");
	}
	let queryEmbedding: number[] = (await embed(question)) as number[];
	const { neighbors, distances } = searchKNNWithThresholds(vectors, queryEmbedding, 0.7, 5.0);
	console.log("Neighbors:", neighbors, "Distances:", distances);

	return qa[neighbors[0]][1] ?? fallbackAnswer;
}
