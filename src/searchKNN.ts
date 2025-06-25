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

	// Sắp xếp giảm dần theo độ tương đồng
	similarities.sort((a, b) => b.score - a.score);

	const neighbors = similarities.slice(0, k).map((item) => item.index);
	const distances = similarities.slice(0, k).map((item) => item.score);
	return { neighbors, distances };
}
