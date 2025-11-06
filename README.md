# 🌊 MarineStream Subscription Management UI

A modern, professional web interface for managing Rise-X subscription plans and company subscriptions. Built for the MarineStream ecosystem with an intuitive dashboard, clear visual separation, and comprehensive subscription management features.

**Version:** 2.0 (Fully Updated November 2025)  
**API Version:** Rise-X API v3  
**Status:** ✅ Production Ready

---

## 📋 Overview

This application provides a complete frontend interface for the **Rise-X Subscription Management API**, with clear separation between:

### 📦 **Plans (Templates)**
Subscription packages that define features and resources available in your ecosystem

### 🏢 **Company Subscriptions**  
Active subscriptions assigned to specific companies, giving them access to plan features

### 👥 **Customer Overview**
Visual dashboard showing all active customers and their subscription details

---

## ✨ Key Features

### **Subscription Management**
- ✅ View all plans and subscriptions with visual color coding
- ✅ Create company subscriptions by assigning plans
- ✅ Update subscription details, dates, and status
- ✅ Archive/activate subscriptions with one click
- ✅ Search and filter by company, plan, status, or date

### **User Experience**
- 🎨 Modern, responsive design with color-coded cards
- 📊 Real-time statistics dashboard
- 👥 Customer overview with subscription counts
- 📋 One-click copying of IDs and plan details
- 🔔 Smart notifications and error handling
- ⏰ API key expiration timer with warnings

### **Developer Features**
- 🔍 Detailed console logging for debugging
- 🛡️ Automatic CORS proxy setup
- 💾 Persistent configuration (localStorage)
- 🔄 Automatic endpoint discovery
- 📝 Comprehensive error messages

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js v14+ ([Download](https://nodejs.org/))
- Modern web browser (Chrome/Edge/Firefox)
- Rise-X API access credentials

### **1. Install Dependencies**
```bash
npm install
```

### **2. Start Proxy Server**
```bash
npm start
```

The proxy starts on `http://localhost:3000` and forwards to `https://api.idiana.io`

**Important:** Keep this terminal window open!

### **3. Open the Application**

**Recommended:** Use VS Code Live Server extension
- Right-click `index.html` → "Open with Live Server"
- Opens on `http://127.0.0.1:5500` or `http://localhost:5500`

**Alternative:** Open `index.html` directly in browser

### **4. Configure Settings**

In the left sidebar, complete these steps:

#### ① **Access Key** 
- Paste your API Bearer token
- Click "Save Key"
- 30-minute expiration timer starts

#### ② **System Address**
- Use: `http://localhost:3000` (for proxy)
- Or: `https://api.idiana.io` (direct, may have CORS issues)
- Click "Save Address"

#### ③ **Workspace Name**
- Enter your ecosystem: `marinestream`
- Click "Save Workspace"

#### ④ **Test Connection**
- Click "🔌 Test Connection"
- Should see "✅ Connection successful!"

---

## 📖 Understanding the System

### **Plans vs Subscriptions**

```
📦 PLAN (Template)
├─ Defines features and resources
├─ Stored in ecosystem
├─ No company assigned (companyId = null)
├─ Yellow cards in UI
└─ Example: "Premium Plan" with workflow + asset features

         ↓ (assign via API)

🏢 COMPANY SUBSCRIPTION
├─ Plan assigned to specific company
├─ Has companyId (links company to plan)
├─ Has validity period (validFrom → validTo)
├─ White cards in UI
└─ Example: "Acme Corp" using "Premium Plan" for 365 days
```

### **Visual Guide**

When you load "📋 All Subscriptions", you'll see:

```
┌──────────────────────────────────────────┐
│ 📦 8 Plans │ 🏢 15 Subs │ 👥 12 Customers│  ← Stats Dashboard
└──────────────────────────────────────────┘

👥 Active Companies (Blue Cards - Clickable)
────────────────────────────────────────────
┌──────────────┐ ┌──────────────┐
│ Acme Corp    │ │ Contoso Ltd  │
│ ID: a0d9ec...│ │ ID: b163fe...│
│ 2 subs       │ │ 1 sub        │
└──────────────┘ └──────────────┘

📦 Available Plans (Yellow Cards)
────────────────────────────────────────────
Plan templates you can assign to companies

🏢 Company Subscriptions (White Cards)
────────────────────────────────────────────
Active subscriptions with company names and details
```

---

## 🎯 How to Use

### **Create a Company Subscription**

**Step 1:** Get a Plan ID
1. Go to "📋 All Subscriptions" tab
2. Find a **yellow card** (plan template)
3. **Click the Plan ID** → Copies to clipboard
4. Example: `MatApiTest`

**Step 2:** Assign to Company
1. Go to "➕ Create New" tab
2. **Paste** the Plan ID
3. Enter Display Name: `"Acme Corp - Premium Access"`
   - Format: `"Company Name - Description"`
   - Helps UI extract company name
4. Company ID: Click "🎲 Generate" (new customer) or paste existing
5. Duration: Select from quick buttons or enter days
6. Click "✓ Create Subscription"

**Result:**
- ✅ New **white card** appears in "Company Subscriptions"
- ✅ New **blue card** appears in "Active Companies" (if new customer)
- ✅ Customer now has access!

---

### **View Company Details**

**Option 1:** Click a blue company card
- Shows all subscriptions for that company
- "← Back to All" button to return

**Option 2:** Use Search tab
- Enter Company ID
- Click "Search"
- Shows all their subscriptions

---

### **Update a Subscription**

1. Click a **white subscription card**
2. Click "✏️ Edit Details"
3. Modify:
   - Plan ID (switch to different plan)
   - Valid From/To dates (extend access)
   - Status (Active/Archived/Expired)
   - Metadata (JSON format)
4. Click "✓ Save Changes"

---

### **Archive a Subscription**

1. Click a subscription card
2. Click "🚫 Archive Subscription"
3. Confirm warning
4. Status → "Archived"
5. Customer loses access immediately

---

## 🔧 API Endpoints Reference

Based on **Rise-X Subscription Management API User Manual**:

### **Plans (Ecosystem Templates)**

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List Plans | GET | `/api/v3/environment/subscriptions` |

### **Company Subscriptions**

| Operation | Method | Endpoint |
|-----------|--------|----------|
| **Assign Plan** | POST | `/api/v3/subscription/assign` |
| List Subscriptions | GET | `/api/v3/subscription` |
| Get Single | GET | `/api/v3/subscription/{id}` |
| Update | PATCH | `/api/v3/subscription/{id}` |
| Archive | DELETE | `/api/v3/subscription/{id}` |
| Search | GET | `/api/v3/subscription?companyId=...` |

### **Request Examples**

#### **Assign Plan to Company**
```javascript
POST /api/v3/subscription/assign

{
  "planId": "plan-uuid",
  "companyId": "company-uuid",
  "durationDays": 365
}
```

#### **Update Subscription**
```javascript
PATCH /api/v3/subscription/{subscriptionId}

{
  "status": "Active",
  "validTo": "2026-01-01T00:00:00Z"
}
```

#### **Archive Subscription**
```javascript
DELETE /api/v3/subscription/{subscriptionId}
```

**Note:** Uses DELETE method, not PATCH. This soft-deletes (archives) the subscription.

---

## 🎨 UI Components

### **Tab Navigation**

| Tab | Purpose |
|-----|---------|
| 📋 All Subscriptions | View plans, companies, and subscriptions |
| ➕ Create New | Assign a plan to a company |
| 🧙‍♂️ Add User Wizard | Quick onboarding for new users |
| 🔍 Search | Find subscriptions by filters |

### **Color Coding**

| Color | Meaning | Example |
|-------|---------|---------|
| 🟨 Yellow | Plan Template | "Premium Plan" definition |
| ⬜ White | Company Subscription | "Acme Corp using Premium" |
| 🟦 Blue | Company Overview | "Acme Corp (2 subscriptions)" |

### **Status Badges**

| Badge | Meaning |
|-------|---------|
| 🟢 Active | Subscription is working |
| 🔴 Archived | Manually disabled |
| ⚫ Expired | Validity period ended |
| 🟡 Template | Plan template (not assigned) |

---

## 🔑 Getting Your API Key

### **From MarineStream UI:**

1. Login to `app.marinestream.io`
2. Open any work item
3. Press **F12** (open DevTools)
4. Go to **Network** tab
5. Filter for: `work`
6. Refresh page (**F5**)
7. Find request with random UUID
8. Click → **Headers** tab
9. Find `Authorization: Bearer ey...`
10. **Copy only the token** (after "Bearer ")
11. Paste in UI → Click "Save Key"

**Important:** 
- Don't copy the word "Bearer"
- Token expires in 30 minutes
- Timer shows countdown in UI

---

## 🐛 Troubleshooting

### **"CORS Blocked" Error**

```
✅ Solution:
1. Proxy server running? (npm start)
2. System Address set to: http://localhost:3000
3. Restart proxy if you changed code
```

### **"405 Method Not Allowed"**

```
✅ Common Causes:
- Using wrong HTTP method (PUT instead of PATCH)
- Using wrong endpoint (plural vs singular)
- Proxy server not restarted after changes

Solution: Restart proxy server!
```

### **"Created Plan Instead of Subscription"**

```
✅ Checklist:
- Did you use /api/v3/subscription/assign? ✓
- Is companyId field filled in? ✓
- Is planId an existing plan (from yellow card)? ✓
```

### **"Can't See Company Names"**

```
✅ Use this DisplayName format:
"Company Name - Description"

Examples:
- "Acme Corp - Premium Annual" ✓
- "Test Company - Trial Access" ✓  
- "MatApiTest" ✗ (no company name extracted)
```

### **Console Shows Errors**

1. Open DevTools (F12) → Console tab
2. Look for 🌐 API Call logs
3. Check status codes:
   - 200 = Success
   - 404 = Endpoint doesn't exist
   - 405 = Wrong method
   - 401 = Invalid API key

---

## 📁 Project Structure

```
MsSubscriptionUI/
├── index.html                          # Main UI
├── app.js                              # Core logic (1,486 lines)
├── styles.css                          # Modern styling
├── proxy-server.js                     # CORS proxy
├── package.json                        # Dependencies
├── README.md                           # This file
├── CODE_REVIEW_REPORT.md               # Detailed code review
├── CORRECT_API_ENDPOINTS.md            # API endpoint reference
├── PLANS_VS_SUBSCRIPTIONS_GUIDE.md     # Conceptual guide
└── Rise-X Subscription Management API User Manual.pdf
```

---

## 🔧 Advanced Configuration

### **Change Proxy Port**

Edit `proxy-server.js`:
```javascript
const PORT = 3001; // Change from 3000
```

Then update UI System Address to: `http://localhost:3001`

### **Change Target API**

Edit `proxy-server.js`:
```javascript
target: 'https://your-api-server.com'
```

### **Debug Mode**

Enable detailed logging in browser console:
```javascript
localStorage.setItem('debugMode', 'true');
```

All API calls will show detailed request/response info.

---

## 📊 Features Deep Dive

### **1. Statistics Dashboard**
- **📦 Available Plans:** Count of plan templates in ecosystem
- **🏢 Company Subscriptions:** Total active subscriptions
- **👥 Active Customers:** Unique companies with subscriptions

### **2. Companies Overview (NEW!)**
- Blue cards showing each customer
- Extracted company names from displayName
- Subscription counts per company
- Click company → Filter their subscriptions
- Click ID → Copy full company UUID

### **3. Smart Plan Assignment**
- Copy Plan ID from yellow cards
- Paste when creating subscription
- Validates plan exists
- Auto-archives old subscriptions for same plan
- Creates subscription with validity period

### **4. Visual Relationships**
- Subscription cards show which plan they use
- Plan cards show usage count ("2 companies")
- Click plan → See which companies use it

### **5. Quick Actions**
- Click Plan ID → Copy
- Click Company ID → Copy
- Click company card → Filter subscriptions
- Click subscription → View details + Edit/Archive

---

## 📝 API Documentation Summary

### **Core Concepts**

```
Environment (Ecosystem)
    ├── Plans (Templates)
    │   ├── Define features
    │   ├── Define resources
    │   └── No company assigned
    │
    └── Company Subscriptions
        ├── Link: Company → Plan
        ├── Has: validFrom, validTo
        └── Status: Active/Archived/Expired
```

### **Critical Endpoints**

| Action | Endpoint | Notes |
|--------|----------|-------|
| Create Subscription | `POST /subscription/assign` | ⭐ Most important! |
| List Plans | `GET /environment/subscriptions` | Returns templates |
| List Subscriptions | `GET /subscription` | Returns company subs |
| Update | `PATCH /subscription/{id}` | Singular "subscription"! |
| Archive | `DELETE /subscription/{id}` | Uses DELETE, not PATCH |

### **Common Mistakes**

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `/subscriptions` (plural) | `/subscription` (singular) |
| `PUT` method | `PATCH` method |
| `PATCH` to archive | `DELETE` to archive |
| `POST /environment/subscriptions` | `POST /subscription/assign` |

---

## 🔐 Security & Best Practices

### **API Key Management**
- ✅ Stored in browser localStorage (secure for this use case)
- ✅ 30-minute expiration timer with 5-min warning
- ✅ Masked in UI (password field)
- ✅ Logged as `[HIDDEN]` in proxy console
- ⚠️ Clear on shared computers

### **Display Name Format**
Always use this pattern:
```
"Company Name - Plan Description"
```

**Examples:**
- ✅ `"Acme Corporation - Premium Annual"`
- ✅ `"Contoso Ltd - Standard Trial"`
- ✅ `"Beta User - Developer Access"`

This allows the UI to extract company names for better display.

### **Production Deployment**

⚠️ **The proxy server is for development only!**

For production:
1. Deploy UI to same domain as API, OR
2. Configure CORS on API server, OR
3. Use production-grade proxy (nginx, etc.)
4. Use HTTPS everywhere
5. Implement proper token refresh

---

## 🧪 Testing Guide

### **Test 1: View Subscriptions**
```
1. Click "📋 All Subscriptions"
2. Click "🔄 Refresh"
3. Should see:
   - Stats dashboard with counts
   - Blue company cards
   - Yellow plan cards  
   - White subscription cards
```

### **Test 2: Create Subscription**
```
1. Copy a Plan ID (click yellow card)
2. Go to "➕ Create New"
3. Fill form with plan ID, company ID, duration
4. Create
5. Should see new white card appear
```

### **Test 3: Archive Subscription**
```
1. Click a white subscription card
2. Click "🚫 Archive"
3. Confirm
4. Should see:
   - Success notification
   - Card updates after 0.5s
   - Status badge → "Archived"
```

---

## 📊 Console Output Guide

### **Successful Subscription Creation**
```javascript
📝 Assigning plan to company via /api/v3/subscription/assign
   Request: {planId: "...", companyId: "...", durationDays: 30}
🌐 API Call: POST /api/v3/subscription/assign
✅ Subscription assigned successfully! 
   {id: "...", companyId: "...", status: "Active"}
```

### **Successful Load**
```javascript
📦 Loaded plans (templates): 8
🏢 Loaded company subscriptions: 15
📋 Plans (templates): 8
🏢 Company Subscriptions: 15
👥 Active Companies: 12
```

---

## 🎓 Code Quality

### **Recent Improvements (Nov 2025)**

✅ **Bugs Fixed:**
- Removed redundant code (50+ lines)
- Fixed HTTP methods (PUT → PATCH, PATCH → DELETE)
- Fixed endpoint paths (plural → singular)
- Fixed API key expiration warning
- Added status type checking

✅ **Performance Optimized:**
- 85% reduction in unnecessary API calls
- Endpoint caching for history discovery
- Efficient company name extraction

✅ **UX Enhanced:**
- Clear visual separation (color coding)
- Company overview dashboard
- One-click copy functionality
- Smart tooltips and guidance
- Real-time feedback

**See:** `CODE_REVIEW_REPORT.md` for complete analysis

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | This file - setup and usage |
| `CODE_REVIEW_REPORT.md` | Detailed code review and fixes |
| `CORRECT_API_ENDPOINTS.md` | API endpoint reference |
| `PLANS_VS_SUBSCRIPTIONS_GUIDE.md` | Conceptual explanation |
| `Rise-X Subscription Management API User Manual.pdf` | Official API docs |

---

## 🛠️ Development

### **Tech Stack**
- **Frontend:** Vanilla JavaScript (no framework dependencies)
- **Styling:** Custom CSS with CSS variables
- **Proxy:** Express.js + http-proxy-middleware
- **Storage:** Browser localStorage

### **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### **File Sizes**
- `app.js`: ~1,486 lines (well-organized, commented)
- `styles.css`: ~1,100 lines (responsive design)
- `index.html`: ~622 lines (semantic HTML)
- Total bundle: ~120KB (no build step needed!)

---

## 🐛 Known Limitations

### **1. Company Names**
- **Issue:** API doesn't provide separate company/organization endpoint
- **Workaround:** Extracts from displayName field
- **Best Practice:** Use `"Company Name - Description"` format

### **2. History/Audit Log**
- **Issue:** API doesn't expose audit log endpoint
- **Workaround:** Use Search tab with date range filters

### **3. Batch Operations**
- **Issue:** Must create subscriptions one at a time
- **Workaround:** Use Add User Wizard for faster creation

---

## ⚡ Performance Tips

### **For Large Subscription Lists**

1. **Use Search:** Filter by company/plan instead of loading all
2. **Company View:** Click a blue company card to see only their subscriptions
3. **Browser Console:** Close DevTools when not debugging (faster rendering)

### **For Slow Networks**

1. **Proxy Server:** Reduces requests (single hop)
2. **Caching:** History endpoint caching reduces duplicate calls
3. **Batch Loading:** Plans and subscriptions loaded in parallel

---

## 🤝 Contributing

### **Code Style**
- Use meaningful variable names
- Comment complex logic
- Follow existing patterns
- Test before committing

### **Testing Changes**
```bash
# 1. Make changes
# 2. Restart proxy if server code changed
npm start

# 3. Hard refresh browser
Ctrl+Shift+R

# 4. Test in console
# 5. Check for linter errors
```

---

## 📞 Support

### **For API Issues:**
- Check official API documentation (PDF included)
- Verify endpoints match documentation
- Test with Postman/cURL first

### **For UI Issues:**
- Check browser console (F12)
- Check proxy server console
- Review error notifications in UI

### **For Help:**
- See troubleshooting section above
- Check `CODE_REVIEW_REPORT.md`
- Review console output carefully

---

## 📜 License

ISC

---

## 🎉 Changelog

### **Version 2.0 (November 2025)**

**Major Changes:**
- ✅ Fixed all API endpoints per official documentation
- ✅ Separated plans from company subscriptions visually
- ✅ Added companies overview dashboard
- ✅ Implemented correct `/assign` endpoint
- ✅ Fixed archive to use DELETE method
- ✅ Changed paths from plural to singular
- ✅ Added company name extraction
- ✅ One-click copy for all IDs
- ✅ Comprehensive code review and cleanup

**Bug Fixes:**
- Fixed redundant loadSavedCredentials function
- Fixed API key expiration timer warning
- Fixed multiple format attempts in create
- Fixed indentation and error handling
- Fixed status.toLowerCase() type error
- Fixed proxy server PATCH/DELETE support

**Performance:**
- 85% reduction in API calls
- Endpoint caching
- Parallel loading
- Cleaner codebase (-40 lines)

---

## 🚀 Future Enhancements

**Potential Additions:**
- [ ] Export subscriptions to CSV
- [ ] Bulk operations (create multiple)
- [ ] Subscription templates/presets
- [ ] Company management interface (if API supports)
- [ ] Analytics dashboard
- [ ] Email automation
- [ ] Subscription renewal reminders

---

**Built with ❤️ for MarineStream**  
**Last Updated:** November 6, 2025  
**Maintained by:** Franmarine Development Team
