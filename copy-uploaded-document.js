const fs = require('fs').promises
const path = require('path')

const staticSrcPath = path.join(__dirname, 'tmp/uploaded_documents')
const staticDestPath = path.join(__dirname, 'dist/uploaded_documents')

const folderToCopies = [
	{
		src: staticSrcPath,
		dest: staticDestPath,
	},
	{
		src: path.join(__dirname, 'chatbot'),
		dest: path.join(__dirname, 'dist/chatbot'),
	},
]

async function copyAssets(src, dest) {
	try {
		const stat = await fs.stat(src)

		if (stat.isDirectory()) {
			await fs.mkdir(dest, { recursive: true })
			const items = await fs.readdir(src, { withFileTypes: true })

			await Promise.all(
				items.map(item => {
					const srcPath = path.join(src, item.name)
					const destPath = path.join(dest, item.name)
					return copyAssets(srcPath, destPath)
				}),
			)
		} else {
			// Ensure destination directory exists
			await fs.mkdir(path.dirname(dest), { recursive: true })
			await fs.copyFile(src, dest)
		}
	} catch (err) {
		console.error(`Error copying from ${src} to ${dest}:`, err.message)
		throw err
	}
}

const greenTick = `\x1b[32m\u2713\x1b[0m`
const redCross = `\x1b[31m\u274C\x1b[0m`

folderToCopies.map(item =>
	copyAssets(item.src, item.dest)
		.then(() => console.log(greenTick, item.dest))
		.catch(() => console.log(redCross, item.dest)),
)
