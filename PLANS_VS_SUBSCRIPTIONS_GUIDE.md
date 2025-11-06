# 📘 Understanding Plans vs Company Subscriptions

## CRITICAL UNDERSTANDING

Your Rise-X API has **TWO DIFFERENT CONCEPTS** that were being confused:

### 📦 **Plans (Templates)**
- **What:** Subscription packages that define features
- **Location:** Stored in your environment/workspace
- **Purpose:** Templates you can assign to companies
- **Company ID:** `undefined` or `null` (not assigned to anyone)
- **Status:** Usually "Template" or "Active"
- **Endpoint:** `/api/v3/environment/subscriptions`
- **Example:** "MarineStream Premium Plan" with workflow + asset features

### 🏢 **Company Subscriptions**
- **What:** A plan assigned to a specific company
- **Location:** Links a company to a plan
- **Purpose:** Gives a company access to plan features
- **Company ID:** **HAS A VALUE** (the company using it)
- **Status:** Active, Archived, or Expired
- **Endpoint:** `/api/v3/subscriptions` (probably - we're testing)
- **Example:** "Acme Corp" using "MarineStream Premium Plan"

---

## 🔴 THE PROBLEM YOU ENCOUNTERED

### What You Thought You Were Doing:
```
"Create a subscription for Acme Corp"
→ Fill in form with company details
→ Click Create
→ Acme Corp gets access to plan ✅
```

### What Actually Happened:
```
"Create a subscription for Acme Corp"
→ Fill in form with company details
→ Click Create
→ NEW PLAN TEMPLATE created ❌
→ No company assignment
→ Acme Corp has NO access
```

### Why This Happened:

The endpoint `/api/v3/environment/subscriptions` **creates plan templates**, not company subscriptions!

**Evidence:**
```javascript
// What you created (console output)
{
  id: '03a4308f-3b0a-4901-8669-94c4a5ea5cfb',
  displayName: 'MatApiTest',
  status: 'Active',
  companyId: undefined  // ← No company! It's a template!
}
```

---

## ✅ THE FIX

I've updated the code to:

### 1. **Try Multiple Endpoints**
The app now tries these endpoints in order:
1. `/api/v3/subscriptions` - Most likely correct endpoint
2. `/api/v3/company/subscriptions` - Alternative
3. `/api/v3/company/{companyId}/subscriptions` - Company-specific
4. `/api/v3/environment/subscriptions` - Fallback

### 2. **Verify Result**
After creating, the app checks:
```javascript
if (result.companyId && result.companyId !== null) {
    // SUCCESS - Created company subscription!
} else {
    // FAIL - Created plan template, try next endpoint
}
```

### 3. **Better UI Guidance**
- Clear warnings in the "Create New" tab
- Explanation of plans vs subscriptions
- Instructions to copy Plan IDs from existing plans
- Visual color coding (yellow = plans, white = subscriptions)

---

## 🎯 CORRECT WORKFLOW

### **To Create a Company Subscription:**

```
STEP 1: Find an Existing Plan
├─ Go to "📋 All Subscriptions" tab
├─ Look at the yellow cards (these are PLANS)
├─ Click on a Plan ID to copy it
└─ Example: Copy "MatApiTest"

STEP 2: Assign Plan to Company
├─ Go to "➕ Create New" tab
├─ Paste the Plan ID
├─ Enter Company ID (generate new UUID or reuse existing)
├─ Fill in display name and duration
└─ Click "Create Subscription"

STEP 3: Verify
├─ App tries multiple endpoints
├─ Checks if result has companyId
├─ If yes → Success! Company subscription created
└─ If no → Tries next endpoint
```

---

## 📊 VISUAL GUIDE

### What You'll See in "All Subscriptions" Tab:

```
┌─────────────────────────────────────────┐
│  📦 6 Plans  │ 🏢 1 Sub  │  👥 1 Customer │
└─────────────────────────────────────────┘

📦 Available Subscription Plans (Yellow Cards)
────────────────────────────────────
┌──────────────────┐ ┌──────────────────┐
│ MarineStream     │ │ MatApiTest       │
│ Template         │ │ Active    1 co.  │ ← Used by 1 company
│ Plan ID: abc-123 │ │ Plan ID: def-456 │
└──────────────────┘ └──────────────────┘
        ↑                      ↑
   Not assigned          Being used!


🏢 Company Subscriptions (White Cards)
────────────────────────────────────
┌──────────────────┐
│ Acme Corp        │
│ Active           │
│ Using: MatApiTest│ ← Links to plan above
│ Company: xyz-789 │
│ Valid: 365 days  │
└──────────────────┘
        ↑
    Real subscription!
```

---

## 🔍 HOW TO TELL THEM APART

### Plan Template (Yellow Card):
```javascript
{
  id: "plan-uuid",
  displayName: "Premium Plan",
  status: "Template" or "Active",
  companyId: undefined,  // ← Key difference!
  features: {...},  // What the plan offers
  resources: [...]
}
```

### Company Subscription (White Card):
```javascript
{
  id: "subscription-uuid",
  displayName: "Acme Corp - Premium",
  planId: "plan-uuid",  // ← Which plan they're using
  companyId: "company-123",  // ← Which company has it
  status: "Active",
  validFrom: "2025-01-01",
  validTo: "2026-01-01"
}
```

---

## 🚀 TESTING THE FIX

### Test 1: Create Company Subscription

1. **Open browser console** (F12)
2. Go to "➕ Create New" tab
3. Fill in form with:
   - Display Name: "Test Company - Trial"
   - Plan ID: Copy from a yellow plan card
   - Company ID: Click "Generate"
   - Duration: 30 days
4. Click "Create Subscription"

**Watch the console:**
```
📝 Creating company subscription with: {...}
🔍 CompanyId present: true Value: [uuid]
🔄 Attempt 1/4: Trying endpoint: /api/v3/subscriptions
✅ Success! Result: {...}
📋 Created item has companyId? [uuid] Status: Active
✅ Correct endpoint found: /api/v3/subscriptions
```

**If successful:**
- ✅ Console shows `companyId: [actual-uuid]`
- ✅ New white card appears in Company Subscriptions section
- ✅ Success notification

**If creates plan template instead:**
- ⚠️ Console shows `companyId: undefined`
- ⚠️ New yellow card appears in Plans section
- ❌ App tries next endpoint automatically

---

## 🐛 DEBUGGING GUIDE

### Scenario 1: All Endpoints Fail
```
❌ Could not create company subscription. 
   All attempted endpoints either failed or created plan templates.
```

**Solution:**
- Your API might not support company subscriptions
- Or requires a different endpoint structure
- Check API documentation for company/subscription endpoints
- Contact API provider

### Scenario 2: Creates Plan Template Every Time
```
⚠️ Endpoint created a PLAN TEMPLATE (no companyId)
```

**Possible Causes:**
1. The API endpoint ignores `companyId` field
2. Need different endpoint (not `/api/v3/environment/subscriptions`)
3. API requires additional fields to create company subscriptions

**Check:**
- Look at console to see which endpoint was tried
- Check if `companyId` is being sent in request body
- Verify API response to see if it's being ignored

### Scenario 3: One Endpoint Works!
```
✅ Correct endpoint found: /api/v3/subscriptions
```

**Next Steps:**
1. Note which endpoint worked
2. Update code to use that endpoint first
3. Remove unsuccessful endpoints from the list

---

## 💡 KEY INSIGHTS

### 1. **Endpoint Naming**
```
/api/v3/environment/subscriptions  → Manages PLAN TEMPLATES for environment
/api/v3/subscriptions              → Manages COMPANY SUBSCRIPTIONS (probably)
/api/v3/company/subscriptions      → Company subscriptions (alternative)
```

### 2. **Required Fields**

**For Plan Template:**
```json
{
  "DisplayName": "Plan Name",
  "features": {...},
  // NO companyId
}
```

**For Company Subscription:**
```json
{
  "DisplayName": "Company - Plan",
  "planId": "existing-plan-id",
  "companyId": "company-uuid",  // ← REQUIRED!
  "durationDays": 365
}
```

### 3. **Response Verification**

Always check the response:
```javascript
if (response.companyId !== undefined && response.companyId !== null) {
    // Created company subscription ✅
} else {
    // Created plan template ❌
}
```

---

## 📋 UPDATED UI FEATURES

### 1. **Stats Dashboard**
Shows count of:
- 📦 Available Plans (templates)
- 🏢 Company Subscriptions (assignments)
- 👥 Active Customers (unique companies)

### 2. **Color Coding**
- **Yellow cards** = Plans (templates you can assign)
- **White cards** = Subscriptions (companies with access)

### 3. **Click to Copy**
- **Plan IDs** on yellow cards → Click to copy
- **Company IDs** on white cards → Click to copy
- Instant feedback notifications

### 4. **Visual Relationships**
- White subscription cards show "Using Plan: [name]"
- Yellow plan cards show "[X] companies" usage badge
- Plan details show which companies are using it

### 5. **Clear Instructions**
- Warning in Create New tab
- Step-by-step workflow guide
- Common mistakes highlighted
- Tooltips and help icons

---

## 🧪 WHAT TO TEST NOW

### Test 1: Endpoint Discovery
**Goal:** Find which endpoint creates company subscriptions

1. Clear browser console
2. Create a subscription with all fields filled
3. Watch console output
4. Note which endpoint returns `companyId: [value]`

### Test 2: Verify Separation
**Goal:** Confirm plans and subscriptions are separate

1. Go to All Subscriptions
2. Count yellow cards (plans)
3. Count white cards (company subscriptions)
4. They should match the stats at top

### Test 3: Plan Reuse
**Goal:** Assign same plan to multiple companies

1. Copy a Plan ID from yellow card
2. Create subscription with Company ID: "test-company-1"
3. Create subscription with Company ID: "test-company-2"
4. Same plan should show "2 companies" badge

---

## 📝 NEXT STEPS

1. **Test Create Subscription**
   - Try creating with console open
   - See which endpoint works
   - Report back which one succeeded

2. **Update Code** (if needed)
   - Once we know the correct endpoint
   - Remove unsuccessful endpoints
   - Set correct one as primary

3. **Document Finding**
   - Add to README which endpoint works
   - Update API documentation references
   - Share finding with API provider

---

## 🎓 SUMMARY

**The Core Issue:**
- `/api/v3/environment/subscriptions` manages PLANS (templates)
- Need different endpoint for COMPANY SUBSCRIPTIONS (assignments)

**The Fix:**
- Try multiple endpoints
- Verify result has `companyId`
- Only succeed if company subscription created

**The UI Improvements:**
- Clear visual separation (yellow vs white)
- Step-by-step instructions
- Warning about common mistakes
- Debugging output in console

---

**Try creating a subscription now and check the console!** It will show you exactly which endpoint works for creating actual company subscriptions vs plan templates.

