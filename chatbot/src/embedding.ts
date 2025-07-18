// src/utils/embedding.ts
import { pipeline, env } from '@xenova/transformers'
import { Embeddings } from 'langchain/embeddings/base'

// Cấu hình lại cache (như cũ)
process.env.TRANSFORMERS_CACHE = '/tmp/transformers_cache'
env.useFSCache = false
env.useBrowserCache = false

let embedder: any = null

export async function initEmbedder() {
	if (!embedder) {
		embedder = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', {
			quantized: false,
		})
	}
}

export async function embed(text: string) {
	if (!embedder) await initEmbedder()
	const out = await embedder(text.toLowerCase(), { pooling: 'mean' })
	return Array.from(out[0].data) as number[] // NOSONAR
}

export class CustomXenovaEmbeddings extends Embeddings {
	async embedQuery(text: string): Promise<number[]> {
		return embed(text)
	}

	async embedDocuments(texts: string[]): Promise<number[][]> {
		if (!embedder) await initEmbedder()
		const results: number[][] = []

		for (const text of texts) {
			const out = await embedder(text.toLowerCase(), { pooling: 'mean' })
			results.push(Array.from(out[0].data))
		}

		return results
	}
}
