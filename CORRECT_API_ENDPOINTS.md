# ✅ CORRECT API ENDPOINTS - Rise-X Subscription Management

**Source:** Rise-X Subscription Management API User Manual  
**Date Fixed:** November 6, 2025

---

## 🎯 CRITICAL CORRECTIONS

### ❌ **WRONG** (What we were using):
```javascript
// Creating subscriptions
POST /api/v3/environment/subscriptions  // ← Creates PLAN TEMPLATES!

// Updating subscriptions  
PATCH /api/v3/environment/subscriptions/{id}  // ← Wrong path!

// Archiving subscriptions
PATCH /api/v3/environment/subscriptions/{id}  // ← Wrong method!
```

### ✅ **CORRECT** (From documentation):
```javascript
// Creating company subscriptions (assigning plan to company)
POST /api/v3/subscription/assign  // ← THIS IS IT!

// Updating subscriptions
PATCH /api/v3/subscription/{id}  // ← Singular "subscription"!

// Archiving subscriptions
DELETE /api/v3/subscription/{id}  // ← Use DELETE!
```

---

## 📋 COMPLETE API REFERENCE

### 1. **List Available Plans (Templates)**
```
GET /api/v3/environment/subscriptions
```
**Purpose:** Get all plan templates available in your environment  
**Returns:** Plans with features, resources (NO companyId)  
**Response:**
```json
{
  "plans": [
    {
      "id": "plan-uuid",
      "displayName": "Premium Plan",
      "status": "Template" or "Active",
      "companyId": null,  // ← No company assigned
      "features": {...},
      "resources": [...]
    }
  ]
}
```

---

### 2. **Assign Plan to Company** ⭐ **MOST IMPORTANT**
```
POST /api/v3/subscription/assign
```
**Purpose:** Create a company subscription (assign an existing plan to a company)  
**Request Body:**
```json
{
  "planId": "existing-plan-uuid",
  "companyId": "company-uuid",
  "durationDays": 365
}
```

**Behavior:**
- Validates the plan exists in the ecosystem
- Archives any existing active subscription for the same plan
- Creates new subscription with validity period
- Sets `validFrom` to current date
- Sets `validTo` to current date + duration

**Response:**
```json
{
  "id": "subscription-uuid",
  "planId": "plan-uuid",
  "companyId": "company-uuid",  // ← HAS companyId!
  "environmentId": "env-uuid",
  "status": "Active",
  "validFrom": "2025-01-01T00:00:00Z",
  "validTo": "2026-01-01T00:00:00Z"
}
```

---

### 3. **Get Company Subscriptions**
```
GET /api/v3/subscription?companyId={companyId}
```
**Purpose:** Get subscriptions for a specific company  
**Query Parameters:**
- `companyId` - Filter by company
- `planId` - Filter by plan
- `status` - Filter by status
- `dateFrom` - Filter by date range
- `dateTo` - Filter by date range

**To get ALL company subscriptions:**
```
GET /api/v3/subscription
```
(Without query parameters)

---

### 4. **Get Single Subscription**
```
GET /api/v3/subscription/{subscriptionId}
```
**Purpose:** Get details of a specific company subscription

---

### 5. **Update Subscription**
```
PATCH /api/v3/subscription/{subscriptionId}
```
**Request Body:** (all fields optional)
```json
{
  "id": "subscription-uuid",
  "displayName": "Updated Name",
  "description": "Updated description",
  "status": "Active",
  "features": {...},
  "resources": [...]
}
```

---

### 6. **Archive Subscription**
```
DELETE /api/v3/subscription/{subscriptionId}
```
**Purpose:** Soft delete - marks subscription as "Archived"  
**Note:** Does NOT permanently delete - maintains audit history

**Response:**
```json
{
  "id": "subscription-uuid",
  "status": "Archived",  // ← Status changed
  ...
}
```

---

## 🔍 KEY DIFFERENCES

### **Environment vs Subscription Endpoints**

| Endpoint | Purpose | Returns |
|----------|---------|---------|
| `/api/v3/environment/subscriptions` | Manage ecosystem plans | Plan templates (no companyId) |
| `/api/v3/subscription/assign` | Assign plan to company | Company subscription (has companyId) |
| `/api/v3/subscription` | Manage company subscriptions | Subscriptions with companyId |

### **Plural vs Singular**

⚠️ **IMPORTANT:** Note the singular vs plural!

- `/api/v3/environment/subscription**s**` → Plans (plural)
- `/api/v3/subscription` → Company subscriptions (singular!)
- `/api/v3/subscription/assign` → Create assignment (singular!)
- `/api/v3/subscription/{id}` → Single subscription (singular!)

---

## 📊 COMPLETE WORKFLOW

### **Scenario: Give "Acme Corp" Access to "Premium Plan"**

#### **Step 1: Check Available Plans**
```http
GET /api/v3/environment/subscriptions
Authorization: Bearer {token}
environment: marinestream
```

Response shows available plans (yellow cards in UI)

#### **Step 2: Assign Plan to Company**
```http
POST /api/v3/subscription/assign
Authorization: Bearer {token}
environment: marinestream
Content-Type: application/json

{
  "planId": "premium-plan-uuid",
  "companyId": "acme-corp-uuid",
  "durationDays": 365
}
```

**This creates a company subscription** (white card in UI)

#### **Step 3: Verify Assignment**
```http
GET /api/v3/subscription?companyId=acme-corp-uuid
Authorization: Bearer {token}
environment: marinestream
```

Shows all subscriptions for Acme Corp

---

## 🔧 WHAT I FIXED IN YOUR CODE

### **Before → After**

| Operation | Before (Wrong) | After (Correct) |
|-----------|----------------|-----------------|
| Create | `POST /api/v3/environment/subscriptions` | `POST /api/v3/subscription/assign` |
| Update | `PATCH /api/v3/environment/subscriptions/{id}` | `PATCH /api/v3/subscription/{id}` |
| Archive | `PATCH .../{id}` with `{status: 'Archived'}` | `DELETE /api/v3/subscription/{id}` |
| Get Single | `GET /api/v3/environment/subscriptions/{id}` | `GET /api/v3/subscription/{id}` |
| Search | `GET /api/v3/environment/subscriptions?...` | `GET /api/v3/subscription?...` |
| List Plans | `GET /api/v3/environment/subscriptions` | ✅ (was correct) |

---

## 📝 REQUEST BODY CHANGES

### **Create/Assign Subscription**

**Before:**
```json
{
  "DisplayName": "...",  // ← Not used by /assign endpoint
  "planId": "...",
  "companyId": "...",
  "durationDays": 365
}
```

**After:**
```json
{
  "planId": "...",        // ← Clean, just these 3
  "companyId": "...",
  "durationDays": 365
}
```

API sets displayName automatically from plan name + company.

---

## ✅ WHAT WILL WORK NOW

### **1. Create Subscription**
- Uses `/api/v3/subscription/assign`
- Actually creates company subscription
- Will show white card with companyId
- Customer gets access

### **2. Update Subscription**
- Uses `/api/v3/subscription/{id}` (singular)
- Can modify dates, status, resources
- Actually updates the subscription

### **3. Archive Subscription**
- Uses `DELETE /api/v3/subscription/{id}`
- Properly archives (soft delete)
- Status changes to "Archived"

### **4. Load Subscriptions**
- Plans from: `/api/v3/environment/subscriptions`
- Company subs from: `/api/v3/subscription`
- Properly separated in UI

---

## 🧪 TESTING

**Refresh your browser and try creating a subscription:**

### **Expected Console Output:**
```
📝 Assigning plan to company via /api/v3/subscription/assign
   Request: {planId: "...", companyId: "...", durationDays: 30}
🌐 API Call: {method: 'POST', endpoint: '/api/v3/subscription/assign', ...}
✅ Subscription assigned successfully! {id: "...", companyId: "...", ...}
```

### **Expected UI:**
- ✅ New **white card** appears in "Company Subscriptions" section
- ✅ Card shows the companyId
- ✅ Card shows "Using Plan: [plan-name]"
- ✅ Stats dashboard updates: "🏢 Company Subscriptions: 1"

---

## 🎉 SUMMARY

**All endpoints are now correct per documentation:**
- ✅ Create uses `/api/v3/subscription/assign`
- ✅ Update uses `/api/v3/subscription/{id}` (singular)
- ✅ Archive uses `DELETE` method
- ✅ Fetch uses `/api/v3/subscription/{id}` (singular)
- ✅ Search uses `/api/v3/subscription?params`
- ✅ Plans still use `/api/v3/environment/subscriptions`

**Everything should work perfectly now!** 🚀

