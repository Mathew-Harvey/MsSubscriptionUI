# 📋 Resource Names vs UUIDs

## The Situation

The Rise-X API **does not provide friendly names** when returning subscription resources. Here's what we get:

### What the Subscription API Returns
```json
{
  "resources": [
    {
      "originId": "df596c86-ee83-6aa4-bf62-1e46f847cf9a",
      "type": "Flow",
      "features": ["Submit", "Start", "Customise", "Create", ...]
    }
  ]
}
```

Notice: **Only the UUID (`originId`), not the friendly name!**

---

## What We Tried

The app tries to load all flows/assets to build a lookup table:

```
GET /api/v3/flows       → 404 Not Found
GET /api/v3/assets      → 404 Not Found
GET /api/v3/flow        → (tries this too)
GET /api/v3/asset       → (tries this too)
```

**Result:** None of these endpoints exist, so we can't get friendly names.

---

## Current Solution

Since we can't get friendly names, the app now:

### 1. Shows Shortened UUIDs
Instead of showing the full UUID:
```
df596c86-ee83-6aa4-bf62-1e46f847cf9a
```

It shows:
```
Flow df596c86
```

Much more readable!

### 2. Adds a Tooltip
Hover over any resource to see the full technical ID:
```
Hover → "Resource ID: df596c86-ee83-6aa4-bf62-1e46f847cf9a"
```

### 3. Shows an Info Notice
At the top of Current Access:
```
ℹ️ Showing technical IDs - hover over any resource to see full ID
```

---

## What You'll See

### Current Access Display

```
CURRENT ACCESS
ℹ️ Showing technical IDs - hover over any resource to see full ID

┌─ MarineStream ───────────────── [Active] ─┐
│ Expires: 27/03/2028                        │
│ ──────────────────────────────────────────  │
│ 🔄 Flow df596c86      Submit, Start, ...   │ ← Shortened UUID
│ 🔄 Flow 3eaf98b4      Submit, Start, ...   │
│ 📦 Asset 7bf2aaea     View, Create, ...    │
│ 📦 Asset 22814a5a     View, Create, ...    │
└────────────────────────────────────────────┘
```

Not perfect, but **much better than showing 40-character UUIDs**!

---

## For Adding New Resources

### If Search Works (When Available)
1. Click 🔍
2. Type flow/asset name
3. Select from results
4. Name fills in automatically

### If Search Doesn't Work (Current Situation)
1. Go to MarineStream admin
2. Copy the resource ID (UUID)
3. Paste directly into the resource field
4. No need to click 🔍 - just paste and go!

**The field now accepts manual input** - it's not readonly anymore.

---

## Why This Happens

### The API Limitations

The Rise-X API has:
- ✅ `/api/v3/subscription` - Returns subscriptions with resource UUIDs
- ❌ `/api/v3/flows` - Doesn't exist (404)
- ❌ `/api/v3/assets` - Doesn't exist (404)

So we can see **what** they have access to (the UUIDs), but not the **names** of those resources.

### Possible Future Fix

If Rise-X adds these endpoints in the future:
- `GET /api/v3/environment/flows` - List all flows with names
- `GET /api/v3/environment/assets` - List all assets with names

The app will **automatically start showing friendly names** with no code changes needed!

---

## Current Workaround

### For Viewing Current Access
You see: `Flow df596c86`

**To find out what this is:**
1. Copy the short ID: `df596c86`
2. Go to MarineStream admin
3. Search for flows/assets containing that ID
4. Find the match

### For Adding New Resources
**Option 1: Search (If It Works Later)**
- Click 🔍
- Search by name
- Select result

**Option 2: Manual Entry (Works Now)**
- Copy UUID from MarineStream admin
- Paste into resource field
- Done!

Both work - use whichever is easier.

---

## Summary

**Current Situation:**
- ❌ Can't get flow/asset friendly names from API
- ✅ Show shortened UUIDs instead (`Flow df596c86`)
- ✅ Full UUID in tooltip (hover to see)
- ✅ Can manually enter resource IDs
- ✅ Info notice explains what you're seeing

**When API Improves:**
- ✅ App will automatically show friendly names
- ✅ No code changes needed
- ✅ Will "just work"

**For Now:**
- Use the shortened UUIDs
- Or match them to names in MarineStream admin
- Or contact Rise-X to ask for the correct endpoints to list flows/assets with names

---

**Bottom line:** The app handles the API limitation gracefully and makes the best of what we have! 🎯

