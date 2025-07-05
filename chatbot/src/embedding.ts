process.env.TRANSFORMERS_CACHE = "/tmp/transformers_cache";
import { env, pipeline } from "@xenova/transformers";

// Tắt file system cache và sử dụng browser cache (hoặc không cache)
env.useFSCache = false;
env.useBrowserCache = false;

let embedder: any = null;

export async function initEmbedder() {
	embedder = await pipeline(
		"feature-extraction",
		"Xenova/paraphrase-multilingual-MiniLM-L12-v2",
		{ quantized: false }
	);
}

export async function embed(text: string) {
	if (!embedder) throw new Error("Embedder chưa init");
	const out = await embedder(text.toLowerCase(), { pooling: "mean" });

	//  mảng chứa 1 `Tensor`, lấy `.data` ra Float32Array
	return Array.from(out[0].data);
}
