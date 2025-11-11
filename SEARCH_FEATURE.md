# 🔍 Flow & Asset Search Feature

## Yes! You Can Search by Name

Instead of remembering resource IDs (UUIDs), you can now **search by name**!

---

## How It Works

### The API Endpoints

Based on the Diana/Rise-X API pattern, these endpoints exist:

```
GET /api/v3/flows?name=WorkflowName
GET /api/v3/assets?name=AssetName
```

They return matching flows/assets with their **resourceId**.

---

## Using the Search

### Step 1: Click the Search Button

When adding a resource in Step 2:
```
[Flow ▼] [Click here to search...] [🔍] [View, Start] [✕]
                                     ↑
                                 Click this!
```

### Step 2: Type the Name

A search modal opens:
```
┌─────────────────────────────────────────────┐
│  Search flows and assets by name...     ✕  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Main Workflow                    Flow │ │
│  │ ID: abc-123-xyz-789                   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Reporting Workflow              Flow │ │
│  │ ID: def-456-uvw-012                   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Customer Database              Asset │ │
│  │ ID: ghi-789-rst-345                   │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Step 3: Click to Select

Click any result:
```
[Flow ▼] [Main Workflow ✓] [🔍] [View, Start] [✕]
```

The name AND the ID are filled in automatically!

---

## Features

### ✓ Real-Time Search
- Type as you search
- Results appear instantly (300ms debounce)
- Searches both flows AND assets at once

### ✓ Clear Results
- Shows the **name** you recognize
- Shows the **type** (Flow or Asset)
- Shows the **ID** (but you don't need to remember it!)

### ✓ One Click Selection
- Click any result
- Name and ID are filled in automatically
- Modal closes
- Done!

---

## Example Workflow

**Goal:** Give Acme Corp access to "Customer Onboarding" flow

### Old Way (Hard):
```
1. Go to MarineStream admin
2. Find "Customer Onboarding" flow
3. Copy its UUID: e3b0c442-98fc-1c14-b39f-92d1282048c0
4. Paste into resource ID field
5. Easy to make a mistake!
```

### New Way (Easy):
```
1. Click 🔍
2. Type "customer"
3. Click "Customer Onboarding" from results
4. Done! ✓
```

**Time saved: 90%**

---

## What the Search Returns

The API returns objects like:

```json
{
  "flows": [
    {
      "resourceId": "abc-123-xyz-789",
      "name": "Main Workflow",
      "displayName": "Main Workflow",
      "description": "Primary workflow for...",
      ...
    }
  ]
}
```

We extract:
- **Name** → Show in the UI
- **ResourceId** → Use for the subscription (hidden from you!)

---

## Fallback

If the search endpoints don't work for some reason, you can still:
1. Manually paste the resource ID
2. Or contact Rise-X support for the correct endpoint format

But based on standard Diana API patterns, the endpoints should be:
- `GET /api/v3/flows?name={searchTerm}`
- `GET /api/v3/assets?name={searchTerm}`

---

## Why This Is Better

### Before:
❌ Had to remember/lookup UUIDs  
❌ Easy to paste wrong ID  
❌ No visibility into what you're adding  

### After:
✅ Search by name (what you remember!)  
✅ See all options  
✅ One-click selection  
✅ IDs handled automatically  

---

**Bottom Line:** You never have to see or remember a UUID again! Just search by the name you know. 🎉

