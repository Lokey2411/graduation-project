import { loadIndex } from './vectorIndex.js'
import { CustomXenovaEmbeddings } from './embedding.js'

let vectors: number[][] = []
let qa: string[][] = []
let embedder: CustomXenovaEmbeddings

const fallbackAnswer =
	'Xin lỗi. Hiện tại tôi chưa thể đưa ra câu trả lời phù hợp nhất cho bạn. Vui lòng chọn mục `Liên hệ` trên website để liên hệ với quản trị hệ thống và khiếu nại về tình huống này.'

function normalize(vec: number[]): number[] {
	const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0))
	return vec.map(x => x / (norm || 1))
}

function cosineSimilarity(a: number[], b: number[]) {
	const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
	const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
	const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
	return dot / (normA * normB)
}

function euclideanDistance(a: number[], b: number[]) {
	return Math.sqrt(a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0))
}

function searchKNNWithThresholds(
	vectors: number[][],
	queryVector: number[],
	cosineThreshold = 0.8,
	euclideanThreshold = 1.0,
) {
	const candidates: { index: number; euclidean: number }[] = []
	vectors.forEach((v, i) => {
		const cos = cosineSimilarity(v, queryVector)
		if (cos >= cosineThreshold) {
			const eucl = euclideanDistance(v, queryVector)
			if (eucl <= euclideanThreshold) {
				candidates.push({ index: i, euclidean: eucl })
			}
		}
	})

	if (!candidates.length) return { neighbors: [], distances: [] }

	let best = candidates[0]
	for (const c of candidates) {
		if (c.euclidean < best.euclidean) {
			best = c
		}
	}
	return {
		neighbors: [best.index],
		distances: [best.euclidean],
	}
}

export async function initChat() {
	try {
		const data = await loadIndex('/app/storage/vectors')
		if (!data?.vectors || !data?.qa) {
			console.warn('No valid index data. Setting empty index.')
			vectors = []
			qa = []
			return
		}
		vectors = data.vectors.map(normalize)
		qa = data.qa.map(item => item.map(str => `${str}`))

		embedder = new CustomXenovaEmbeddings({})
	} catch (error) {
		console.error('Error in initChat:', error)
		vectors = []
		qa = []
	}
}

export async function answer(question: string) {
	if (!vectors?.length || !qa?.length || !embedder) {
		throw new Error('Index hoặc embedder chưa sẵn sàng.')
	}

	const queryEmbedding = await embedder.embedQuery(question)
	const { neighbors, distances } = searchKNNWithThresholds(vectors, queryEmbedding, 0.7, 5.0)

	console.log('Neighbors:', neighbors, 'Distances:', distances)

	if (!neighbors.length) return fallbackAnswer

	const answer = qa[neighbors[0]]?.[1]
	return answer || fallbackAnswer
}
