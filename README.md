# Subscription Management UI

A modern, responsive web interface for managing subscriptions within the Diana ecosystem. This UI allows you to view, create, update, and manage both **Ecosystem Subscriptions (Plans)** and **Company Subscriptions** through an intuitive dashboard.

## Overview

This application provides a frontend interface for the Rise-X Subscription Management API. It supports:

- **Ecosystem Subscriptions (Plans)**: Templates defined at the ecosystem level that specify available features and resources
- **Company Subscriptions**: Active subscription instances assigned to specific companies based on ecosystem plans

### Key Features

- 📋 View all subscriptions/plans with filtering and search
- ➕ Create new company subscriptions from ecosystem plans
- ✏️ Update subscription details (plan, dates, status, metadata)
- 🔍 Search and filter subscriptions by company, plan, status, and date range
- 📊 View detailed subscription information including features and resources
- 🎯 Archive and activate subscriptions
- 💾 Local storage for API credentials

## Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **Modern web browser** (Chrome, Firefox, Edge, Safari)
- **API Access**:
  - Valid API key (Bearer token) from the Diana ecosystem
  - Ecosystem name (e.g., `marinestream`)
  - Access to `https://api.idiana.io`

## Installation

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd MsSubscriptionUI
```

### 2. Install Dependencies

The proxy server requires Node.js dependencies:

```bash
npm install
```

This installs:
- `express` - Web server framework
- `http-proxy-middleware` - Proxy middleware for API requests
- `cors` - CORS handling

### 3. Start the Proxy Server (Required for CORS)

Due to browser CORS restrictions, you need to run a local proxy server:

```bash
npm start
```

The proxy server will start on `http://localhost:3000` and forward requests to `https://api.idiana.io`.

**Note**: Keep this terminal window open while using the UI.

## Configuration

### 1. Open the Application

Open `index.html` in your web browser. You can use:
- A local web server (e.g., VS Code Live Server, Python's `http.server`)
- Or simply double-click the file (some features may not work without a server)

**Recommended**: Use VS Code with the "Live Server" extension for the best experience.

### 2. Configure API Settings

In the header of the application, you'll see three configuration fields:

#### API Base URL
- **Default**: `https://api.idiana.io`
- **For Local Development**: `http://localhost:3000` (when using proxy)
- Click "Save URL" after entering

#### Ecosystem
- Enter your ecosystem name (e.g., `marinestream`)
- This will be sent as the `environment` header in API requests
- Click "Save" after entering

#### API Key
- Enter your Bearer token (JWT) from the Diana ecosystem
- The key is stored locally in your browser
- Click "Save Key" after entering
- Use "Clear" to remove the saved key

**Security Note**: API keys are stored in browser `localStorage`. Clear them when done, especially on shared computers.

## Usage

### Viewing Subscriptions

1. Click the **"Subscriptions"** tab (default view)
2. Click **"Refresh"** to load all subscriptions/plans
3. Click on any subscription card to view detailed information

The subscription list shows:
- Display Name
- Plan ID
- Company ID (if applicable)
- Valid From / Valid To dates
- Status badge

### Creating a Subscription

1. Click the **"Create Subscription"** tab
2. Fill in the required fields:
   - **Plan ID**: The ID of the ecosystem plan to instantiate
   - **Company ID**: The target company for the subscription
   - **Duration (Days)**: Subscription duration (e.g., 365 for 1 year)
3. Click **"Create Subscription"**

The system will create a new company subscription based on the specified plan.

### Updating a Subscription

1. Click on a subscription card to open the details modal
2. Click **"Update"** button
3. Modify any of the following:
   - Plan ID
   - Start Date (Valid From)
   - End Date (Valid To)
   - Status (Active, Archived, Expired)
   - Metadata (JSON format)
4. Click **"Update Subscription"**

### Searching and Filtering

1. Click the **"Search & Filter"** tab
2. Use any combination of filters:
   - **Company ID**: Filter by specific company
   - **Company Name**: Filter by company name
   - **Plan ID**: Filter by plan identifier
   - **Status**: Active, Archived, or Expired
   - **Date From / Date To**: Filter by validity period
3. Click **"Apply Filters"** to search
4. Click **"Clear Filters"** to reset

### Managing Subscription Status

From the subscription details modal:

- **Archive**: Changes status to "Archived" (available for Active subscriptions)
- **Activate**: Changes status to "Active" (available for Archived/Expired subscriptions)

**Note**: The "Pause" functionality is not available in this API version.

## API Reference

This UI implements the following API endpoints (based on the Subscription Management API User Manual):

### Base URL
- Production: `https://api.idiana.io`
- Development: `http://localhost:3000` (via proxy)

### Authentication
All requests require:
- **Header**: `Authorization: Bearer <your-api-key>`
- **Header**: `environment: <your-ecosystem-name>`

### Endpoints

#### Get All Subscriptions/Plans
```
GET /api/v3/environment/subscriptions
```
Returns all ecosystem plans or company subscriptions (depending on permissions).

**Response Format**:
```json
[
  {
    "id": "subscription-id",
    "planId": "plan-id",
    "displayName": "Plan Name",
    "status": "Active",
    "validFrom": "2024-01-01T00:00:00Z",
    "validTo": "2024-12-31T23:59:59Z",
    "features": {...},
    "resources": [...]
  }
]
```

#### Create Subscription
```
POST /api/v3/environment/subscriptions
```

**Request Body**:
```json
{
  "planId": "plan-id",
  "companyId": "company-id",
  "durationDays": 365
}
```

#### Get Single Subscription
```
GET /api/v3/environment/subscriptions/{subscriptionId}
```

#### Update Subscription
```
PUT /api/v3/environment/subscriptions/{subscriptionId}
```

**Request Body** (all fields optional):
```json
{
  "planId": "new-plan-id",
  "status": "Active",
  "validFrom": "2024-01-01T00:00:00Z",
  "validTo": "2024-12-31T23:59:59Z",
  "metadata": {}
}
```

#### Search/Filter Subscriptions
```
GET /api/v3/environment/subscriptions?companyId=xxx&companyName=xxx&planId=xxx&status=Active
```

### Subscription Status Values

- `Active`: Subscription is currently active
- `Archived`: Subscription has been archived
- `Expired`: Subscription has expired
- `Template`: Ecosystem plan template (not a company subscription)

## Data Structures

### Subscription Object (DianaSubscriptionPoco_v2)
```json
{
  "id": "unique-subscription-id",
  "planId": "reference-to-ecosystem-plan",
  "companyId": "company-identifier",
  "environmentId": "ecosystem-id",
  "displayName": "Human-readable name",
  "description": "Detailed description",
  "status": "Active",
  "validFrom": "ISO 8601 date",
  "validTo": "ISO 8601 date",
  "features": {
    "baseFeatures": ["workflow", "assets"],
    "advancedFeatures": []
  },
  "resources": [
    {
      "resourceId": "resource-id",
      "resourceType": "Flow",
      "permissions": ["read", "execute"]
    }
  ]
}
```

## Troubleshooting

### CORS Errors

**Error**: `Access to fetch has been blocked by CORS policy`

**Solution**: 
1. Make sure the proxy server is running (`npm start`)
2. Set your Base URL to `http://localhost:3000` in the UI
3. Check that the proxy server console shows requests being forwarded

### 404 Not Found

**Error**: `GET ... 404 (Not Found)`

**Possible Causes**:
1. Incorrect API base URL - should be `https://api.idiana.io` or `http://localhost:3000`
2. Ecosystem name not set or incorrect
3. API endpoint path changed

**Solution**:
1. Verify your ecosystem name matches exactly (case-sensitive)
2. Check browser console for the exact URL being called
3. Check proxy server console for forwarded requests

### Authentication Errors

**Error**: `401 Unauthorized` or `403 Forbidden`

**Solution**:
1. Verify your API key is correct and not expired
2. Ensure the API key has the necessary permissions
3. Check that the `environment` header is being sent (check Network tab in DevTools)

### Proxy Server Not Starting

**Error**: `Port 3000 already in use`

**Solution**:
1. Close any other applications using port 3000
2. Or modify `PORT` in `proxy-server.js` to use a different port
3. Update the UI base URL accordingly

### Empty Subscription List

**Possible Causes**:
1. No subscriptions exist for your ecosystem
2. API key doesn't have permission to view subscriptions
3. Ecosystem name is incorrect

**Solution**:
1. Verify in Postman or API directly that subscriptions exist
2. Check browser console for API response
3. Verify ecosystem name matches your account

## Development

### Project Structure

```
MsSubscriptionUI/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── app.js              # Core JavaScript logic and API integration
├── proxy-server.js     # CORS proxy server (Node.js)
├── package.json        # Node.js dependencies
└── README.md           # This file
```

### Testing the API Directly

You can test API endpoints using:

1. **Postman**: Import the API collection
2. **Browser Console** (when logged into tmarinestream): Use `test-api-console.js`
3. **cURL**:
   ```bash
   curl -X GET "https://api.idiana.io/api/v3/environment/subscriptions" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "environment: marinestream" \
     -H "Content-Type: application/json"
   ```

### Browser Console Testing

The project includes test scripts you can use in the browser console:

- **`test-api-console.js`**: Test API endpoints directly
- **`test-endpoints.js`**: Test multiple endpoint patterns

Load them in the console:
```javascript
fetch('test-api-console.js').then(r => r.text()).then(eval);
```

## Security Notes

⚠️ **Important Security Considerations**:

1. **API Keys**: Never commit API keys to version control. They are stored in browser `localStorage` only.
2. **Proxy Server**: The proxy server is for development only. Do not deploy it to production.
3. **CORS**: The proxy bypasses CORS restrictions. In production, the API should have proper CORS headers configured.
4. **HTTPS**: Always use HTTPS in production. The development proxy uses HTTP for local testing only.

## License

ISC

## Support

For API documentation, refer to the `Rise-X Subscription Management API User Manual.pdf` file included in this repository.

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Check the proxy server console for request/response details
4. Verify API access using Postman or direct API calls

---

**Last Updated**: Based on API version 3.0  
**API Base URL**: `https://api.idiana.io`  
**Documentation**: See included PDF manual
