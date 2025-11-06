# CORS Proxy Setup Guide

Since the API doesn't have CORS headers enabled, you need to use a proxy server to bypass CORS restrictions during development.

## Quick Setup (Option 1: Node.js Proxy)

### Step 1: Install Node.js
If you don't have Node.js installed, download it from: https://nodejs.org/

### Step 2: Install Dependencies
Open a terminal in this project folder and run:
```bash
npm install
```

### Step 3: Start the Proxy Server
```bash
npm start
```

You should see:
```
🚀 CORS Proxy Server Running
📍 Local URL: http://localhost:3000
```

### Step 4: Update Your UI
1. Open `index.html` in your browser
2. Change the **Base URL** from `https://api.rise-x.io` to `http://localhost:3000`
3. Click "Save URL"
4. Enter your ecosystem and API key as before
5. Now try loading subscriptions!

The proxy will forward all requests to `https://api.rise-x.io` and add the necessary CORS headers.

## Alternative: Browser Extension (Option 2)

If you don't want to run a proxy server:

1. **Chrome/Edge**: Install "CORS Unblock" extension
   - Go to Chrome Web Store
   - Search for "CORS Unblock" or "Allow CORS"
   - Install and enable it
   - ⚠️ Only enable when testing this app!

2. **Firefox**: Install "CORS Everywhere" extension
   - Similar to Chrome version

3. Keep your base URL as `https://api.rise-x.io`

## Testing the Proxy

Once the proxy is running, test it in your browser console:

```javascript
fetch('http://localhost:3000/api/v3/environment/marinestream/subscriptions', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Stopping the Proxy

Press `Ctrl+C` in the terminal where the proxy is running.

