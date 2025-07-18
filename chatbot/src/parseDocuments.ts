import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";

export async function parseDocuments(dir: string): Promise<string[][]> {
	const pairs: string[][] = [];
	const files = await fs.readdir(dir);
	console.log("Files found:", files);
	for (const fn of files) {
		const fp = path.join(dir, fn);
		const stat = await fs.stat(fp);
		if (!stat.isFile()) continue;
		let text = "";
		if (fn.endsWith(".txt")) {
			text = await fs.readFile(fp, "utf8");
		} else if (fn.endsWith(".docx")) {
			const { value } = await mammoth.extractRawText({ path: fp });
			text = value;
		} else continue;
		// Tách QA
		let q = null;
		console.log(text + "of" + fn);
		for (const line of text.split(/\r?\n/)) {
			const t = line.trim();
			if (t.startsWith("Câu hỏi:")) {
				q = t.replace("Câu hỏi:", "").trim();
			} else if (t.startsWith("Câu trả lời:") && q) {
				const a = t.replace("Câu trả lời:", "").trim();
				pairs.push([q, a]);
				q = null;
			} else if (t.includes("|||")) {
				const [q, a] = t.split("|||").map((s) => s.trim());
				pairs.push([q, a]);
			}
		}
	}
	return pairs;
}
