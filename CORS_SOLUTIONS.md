# CORS Error Solutions

If you're encountering CORS (Cross-Origin Resource Sharing) errors when using this UI, here are several solutions:

## Understanding CORS

CORS errors occur when a web page tries to make a request to a different domain than the one serving the page. This is a browser security feature.

## Solutions

### Option 1: Browser Extension (Development/Testing Only)
Install a CORS browser extension:
- **Chrome/Edge**: "CORS Unblock" or "Allow CORS: Access-Control-Allow-Origin"
- **Firefox**: "CORS Everywhere"

⚠️ **Warning**: Only use these for development/testing. Never use them when browsing normally.

### Option 2: Run a Local Proxy Server
Create a simple proxy server to forward requests:

**Using Node.js:**
```javascript
// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/api', createProxyMiddleware({
  target: 'https://api.rise-x.io',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  }
}));

app.listen(3000, () => {
  console.log('Proxy server running on http://localhost:3000');
});
```

Then update the base URL in the UI to: `http://localhost:3000`

### Option 3: Use curl/Postman for Testing
For testing purposes, you can use tools that don't have CORS restrictions:
- **curl** (command line)
- **Postman** (GUI)
- **Insomnia** (GUI)

### Option 4: Contact API Provider
Request that the API provider add CORS headers to their responses:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
```

### Option 5: Use a Backend Server
Instead of calling the API directly from the browser, create a backend server that:
1. Receives requests from your frontend
2. Makes API calls to the Rise-X API
3. Returns the data to your frontend

This is the most secure and production-ready solution.

## Quick Test

To verify the API is working, try this in your browser console (on the Rise-X/tmarinestream domain):

```javascript
fetch('https://api.rise-x.io/api/v3/environment/marinestream/subscriptions', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

If this works from the browser console on the same domain, the API is working but CORS needs to be enabled for cross-origin requests.

