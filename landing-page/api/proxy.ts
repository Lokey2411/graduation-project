import { NowRequest, NowResponse } from '@vercel/node';

export default (req: NowRequest, res: NowResponse) => {
	const targetUrl = `https://graduation-project-be-pearl.vercel.app${req.url}`;
	fetch(targetUrl, {
		method: req.method,
		headers: req.headers as any,
		body: req.body,
	})
		.then(response => {
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return response.json();
		})
		.then(data => res.status(200).json(data))
		.catch(error => res.status(500).json({ error: error.message }));
};
