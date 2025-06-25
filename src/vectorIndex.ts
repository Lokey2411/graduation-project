import hierarchicalPkg from "hnswlib-node";
import fs from "fs";
const { HierarchicalNSW } = hierarchicalPkg;

const DIM = 384; // embedding dim

export async function buildIndex(embeddings: number[][]) {
	return {
		vectors: embeddings,
		serialize() {
			return JSON.stringify(this.vectors);
		},
	};
}

export async function saveIndex(index: any, qa: string[][], filePath: string) {
	const data = { vectors: index, qa };
	await fs.promises.writeFile(filePath, JSON.stringify(data));
	console.log("Saved index to:", filePath);
}

export async function loadIndex(filePath: string) {
	try {
		const data = await fs.promises.readFile(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error("Error reading index:", error);
		return null;
	}
}
