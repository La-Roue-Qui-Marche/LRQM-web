const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = 'https://api.rqm.duckdns.org/'

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy /api requests to the target URL
app.use('/api', createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // remove /api from the request path
    },
    onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers to the proxied response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    },
    onError: (err, req, res) => {
        console.error(err);
        res.status(500).send('Proxy error');
    },
}));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
