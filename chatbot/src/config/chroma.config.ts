import { ChromaClient, EmbeddingFunction } from "chromadb";
import { embed } from "../embedding.js";

const dummyEmbeddingFunction: EmbeddingFunction = {
	// generate: async (texts: string[]) => {
	// 	return texts.map(() => []);
	// },
	generate: async (texts: string[]) => {
		const result = await embed(texts[0]);
		console.log("Generate result", result);
		return (await Promise.all(texts.map(embed))) as number[][];
	},
};

const client = new ChromaClient({
	host: "localhost",
	port: 8888,
	ssl: false,
});
export async function getCollection() {
	return client.getOrCreateCollection({
		name: "chatbot_collection",
		metadata: { "hnsw:space": "cosine" },
		embeddingFunction: dummyEmbeddingFunction,
	});
}

export default getCollection;
