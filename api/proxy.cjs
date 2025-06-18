const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
	const proxy = createProxyMiddleware({
		target: 'https://graduation-project-be-pearl.vercel.app',
		changeOrigin: true,
	});

	return proxy(req, res, err => {
		if (err) {
			console.error('Proxy error:', err);
			res.statusCode = 500;
			res.end('Proxy error');
		}
	});
};
