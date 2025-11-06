// Simple CORS Proxy Server
// Run this to bypass CORS restrictions during development
// Usage: node proxy-server.js

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors({
    origin: '*', // Allow all origins (change to specific origin in production)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'environment', 'X-Requested-With']
}));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Proxy all /api requests to the Rise-X API
app.use('/api', createProxyMiddleware({
    target: 'https://api.idiana.io',
    changeOrigin: true,
    secure: true, // Verify SSL certificates
    // Don't rewrite path - forward as-is
    pathRewrite: {
        '^/api': '/api' // Keep the /api prefix (no change needed)
    },
    // Add headers to forwarded request
    headers: {
        'X-Forwarded-For': '127.0.0.1',
        'X-Forwarded-Proto': 'http'
    },
    logLevel: 'debug', // Enable detailed logging
    onProxyReq: (proxyReq, req, res) => {
        console.log(`\n📤 Proxying Request:`);
        console.log(`   Method: ${req.method}`);
        console.log(`   Original URL: ${req.url}`);
        console.log(`   Target URL: https://api.idiana.io${req.url}`);
        console.log(`   Headers:`, {
            'Authorization': req.headers.authorization ? 'Bearer [HIDDEN]' : 'Not set',
            'Content-Type': req.headers['content-type'] || 'Not set',
            'environment': req.headers.environment || 'Not set'
        });
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`\n📥 Proxy Response:`);
        console.log(`   Status: ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
        console.log(`   Headers:`, Object.fromEntries(
            Object.entries(proxyRes.headers).slice(0, 10)
        ));
        
        // Log response body for 404 errors to help debug
        if (proxyRes.statusCode === 404) {
            console.log(`   ⚠️  404 Error - Endpoint may not exist`);
            console.log(`   Requested path: ${req.url}`);
            console.log(`   Full target URL: https://api.idiana.io${req.url}`);
        }
    },
    onError: (err, req, res) => {
        console.error('\n❌ Proxy Error:', err);
        console.error('   Request URL:', req.url);
        console.error('   Error details:', err.message);
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Proxy error', 
                message: err.message,
                details: 'Check proxy server console for more information'
            });
        }
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'CORS proxy server is running' });
});

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 CORS Proxy Server Running');
    console.log('='.repeat(60));
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`🔗 Proxying to: https://api.idiana.io`);
    console.log('');
    console.log('📝 Instructions:');
    console.log(`1. Update your UI base URL to: http://localhost:${PORT}`);
    console.log('2. Keep the ecosystem and API key as before');
    console.log('3. The proxy will forward requests and add CORS headers');
    console.log('');
    console.log('✅ Server ready! Press Ctrl+C to stop');
    console.log('='.repeat(60));
});

