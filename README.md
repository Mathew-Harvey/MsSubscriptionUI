# MarineStream Subscription Manager

> Give your customers access to MarineStream workflows and assets in 2 minutes.

A beautifully simple, Apple-inspired app for managing who can access what in MarineStream. No technical knowledge required.

---

## 🚀 Quick Start (First Time - 60 Seconds)

1. **Open** `index.html` in any browser (Chrome recommended)
2. **Click "Settings"** (top right corner)
3. **Paste your API key** (see below)
4. **Click "Save & Connect"**
5. **You're ready!** ✓

### Getting Your API Key

1. Open `app.marinestream.io` in Chrome and log in
2. Press **F12** to open Developer Tools
3. Click **"Network"** tab
4. Refresh the page (**F5**)
5. Click any request in the list
6. Click **"Headers"** on the right
7. Scroll to find `Authorization: Bearer ey...`
8. Copy **only** the part after "Bearer " (starts with "ey")
9. Paste into Settings

**Important:** Don't copy "Bearer", just the token!  
**Note:** Keys expire after 30 minutes - just grab a new one when needed.

---

## 📋 How to Give a Company Access

### Example: "Acme Corporation" needs access to workflows

**Step 1: Find the User** (30 seconds)

If John from Acme exists:
```
1. Enter: john@acmecorp.com
2. Click "Find Existing User"
3. See John's card with his details
4. Click the card to select
5. ✓ His current access auto-loads!
```

If Acme is brand new:
```
1. Enter: john@acmecorp.com
2. Click "Create New User"
3. Click "Find Existing User"
4. Click John's card
5. ✓ Company created!
```

**Step 2: Create Subscription** (90 seconds)

```
1. Company ID & Name: Already filled in ✓
2. Current Resources: Pre-loaded into form ✓
   • See all their flows, layouts, and assets
   • Remove any (click ✕)
   • Modify permissions
   • Add more (click "+ Add")
3. Name: Auto-suggested "Acmecorp - Premium Access"
4. Duration: Click "1 Year"
5. Click "Create Subscription"
6. ✓ Done!
```

**Total time: ~2 minutes**

---

## ✨ Key Features

### 🎯 Auto-Populate Current Access
When you select a user:
- ✅ Their current subscriptions appear in Step 1
- ✅ All resources auto-fill into Step 2 form
- ✅ Perfect for renewals (everything pre-filled!)
- ✅ Easy to add more or modify
- ✅ Saves 95% of time

### 👁️ See Current Access Grouped by Type
```
🔄 FLOWS (12)
📐 LAYOUTS (3)
📦 ASSETS (15)
```
Each resource shows:
- Shortened ID (first 8 chars)
- Permissions
- Hover for full UUID

### 📧 Work with People, Not IDs
- Search by email, name, or domain
- See user cards with full details
- Click to select
- Company ID handled automatically

### 🎨 Clean & Simple Design
- Apple-inspired interface
- Two clear steps
- No clutter
- Auto-fills everything possible
- Toast notifications

---

## 💡 Common Tasks

### Renew Existing Access

**Scenario:** Acme's subscription expires next month

```
1. Find John from Acme → Click card
2. ALL their resources pre-load into Step 2 ✓
3. Name: "Acmecorp - Renewal 2025"
4. Duration: 1 Year
5. Create Subscription
✓ Renewed in 30 seconds!
```

### Add More Resources

**Scenario:** Acme wants 2 more workflows

```
1. Find John → Click card
2. Current 27 resources pre-load ✓
3. Click "+ Add" twice
4. Paste 2 new workflow IDs
5. Set permissions
6. Create Subscription
✓ Now have 29 resources!
```

### Remove Access

**Scenario:** Acme no longer needs 5 workflows

```
1. Find John → Click card
2. All 27 resources pre-load ✓
3. Click ✕ on the 5 they don't need
4. Keep the other 22
5. Create Subscription
✓ Access updated!
```

### Change Permissions

**Scenario:** Upgrade Acme from View to Edit

```
1. Find John → Click card
2. Resources pre-load with "View, Start" ✓
3. Change all to "View, Start, Edit"
4. Create Subscription
✓ Permissions upgraded!
```

### Find All Users from a Company

**Scenario:** See all Acme employees

```
1. Search: @acmecorp.com
2. See cards for:
   • John Smith - CEO
   • Sarah Johnson - Manager
   • Mike Davis - Engineer
3. Click any one to manage their company's access
```

All users from same domain share the same company & access!

---

## 🔧 Understanding Resources

### Resource Types
- **🔄 Flow** - Workflows/processes they can run
- **📐 Layout** - UI layouts/forms they can access
- **📦 Asset** - Data/files they can access

### Permissions
- **View** - Can see it
- **Start** - Can run/execute it
- **Edit** - Can modify it
- **Create** - Can create new instances
- **Delete** - Can remove it
- **Customise** - Can customize it
- **NoCode** - No-code editing access

**Common combinations:**
- Read-only: `View`
- Basic: `View, Start`
- Full: `View, Start, Edit, Delete`

### Resource IDs
- Each flow/layout/asset has a unique ID (UUID)
- Looks like: `df596c86-ee83-6aa4-bf62-1e46f847cf9a`
- Get these from MarineStream admin panel
- The app shows shortened versions (first 8 chars) for readability
- Hover over any resource to see the full ID

---

## 📊 How Current Access Works

### What You See

When you select a user, the app:

1. **Loads their subscriptions** from the API
2. **Groups resources by type** (Flow, Layout, Asset)
3. **Displays in Step 1** - so you know what they have
4. **Pre-fills Step 2** - so you can renew/modify easily

### Current Access Display

```
CURRENT ACCESS

┌─ MarineStream ──────────────── [Active] ──┐
│ Expires: 27/03/2028                        │
│ ──────────────────────────────────────────  │
│ 🔄 FLOWS (12)                              │
│ df596c86    Submit, Start, Customise...   │
│ 3eaf98b4    Submit, Start, Customise...   │
│ (10 more...)                               │
│                                            │
│ 📐 LAYOUTS (3)                             │
│ 22814a5a    View, Create, Delete...       │
│ (2 more...)                                │
│                                            │
│ 📦 ASSETS (12)                             │
│ fb8119ad    Submit, Start, Create...      │
│ (11 more...)                               │
└────────────────────────────────────────────┘
```

### Pre-Populated Form

All those resources **automatically appear** in Step 2:
- Correct type selected (Flow/Layout/Asset)
- Full resource ID filled in
- Permissions filled in
- Ready to edit, remove, or add more
- Plus 1 empty row for new resources

---

## ⚠️ Important Notes

### About Companies & Users
- **Companies** are created automatically when you add the first user
- All users with same email domain belong to same company
  - `john@acme.com` and `sarah@acme.com` = same company
- **Subscriptions apply to the entire company**, not individual users
- Selecting any user = selecting their company

### About Resource Names
- The API returns resource **IDs only** (UUIDs), not friendly names
- We show **shortened IDs** (first 8 characters) for readability
  - `df596c86-ee83-6aa4-bf62-1e46f847cf9a` → shows as `df596c86`
- **Hover** over any resource to see the full UUID
- Match IDs to names using MarineStream admin panel if needed

### About Subscriptions
- One company can have **multiple subscriptions**
- Each subscription defines what they can access
- New subscriptions **don't replace** old ones - they add to them
- Old subscriptions expire naturally on their end date

---

## 🛠️ Troubleshooting

### "Connection blocked" or CORS errors
**Problem:** Browser blocks API connection

**Solution:**
1. Open Terminal/Command Prompt
2. Navigate to this folder
3. Run: `node proxy-server.js`
4. In Settings, change API Address to: `http://localhost:3000`
5. Save and retry

### "No users found"
**Problem:** User doesn't exist yet

**Solution:**
- Click "Create New User" first
- Then "Find Existing User"

### "API key not configured"
**Problem:** Haven't set up API key

**Solution:**
- Click "Settings"
- Follow steps above to get API key
- Paste and save

### Resources not pre-loading
**Problem:** User has no active subscriptions

**Result:** Form shows 1 empty row (normal!)

### Can't find resource IDs
**Solution:**
- Open MarineStream admin panel
- Navigate to flows/layouts/assets
- Copy the resource ID from there
- Paste into app

---

## 💡 Tips & Tricks

### Search Flexibility
- **Email:** `john@acmecorp.com` - finds that specific user
- **Name:** `John Smith` - finds by name
- **Domain:** `@acmecorp.com` - finds ALL users from Acme
- **Partial:** `john` - finds anyone with "john"

### Quick Renewals
1. Find user
2. Resources pre-load automatically
3. Just click "Create Subscription"
4. Done in 20 seconds!

### Bulk Add Same Access
For 5 companies getting the same package:
```
For each company:
1. Find their user
2. Remove pre-loaded resources (if any)
3. Add your standard package resources
4. Create subscription
5. Click "Create Another"
Time: 90 seconds per company
```

### Check Before Adding
Always review Current Access before creating:
- Avoid duplicate resources
- Check expiry dates
- See what they already have

---

## 📁 What's in This Project

```
MsSubscriptionUI/
├── index.html          # The app interface
├── styles.css          # Apple-inspired design
├── app.js              # All the logic
├── proxy-server.js     # CORS proxy (if needed)
├── package.json        # Dependencies
└── README.md           # This file
```

**Simple and clean!**

---

## 🎯 What Makes This Special

### Designed for Your Workflow
- **You know:** Emails, names, company names
- **You don't want to deal with:** UUIDs, technical IDs
- **The app:** Handles all the technical stuff behind the scenes

### Perfect for Renewals
Most of your work is renewing existing subscriptions:
- Select user
- Current access pre-loads
- Change duration
- Done in 30 seconds!

### Clean & Obvious
- If you can use an iPhone, you can use this
- No manual needed (but you're reading it anyway!)
- Visual feedback at every step
- Clear error messages

---

## 🎨 Design Philosophy

### Apple-Inspired Principles
- **Simplicity** - Only what you need, nothing more
- **Clarity** - Obvious what to do at each step
- **Beauty** - Polished, professional appearance
- **Feedback** - Visual confirmation of every action
- **Speed** - Auto-fill everything possible

### User-Centric
- Work with **people** (users), not IDs
- See **current state** before making changes
- **Pre-populate** forms to save time
- **Visual grouping** (Flows, Layouts, Assets)
- **Auto-suggest** names and values

---

## 📞 Need Help?

### For Technical Issues
- Check browser console (F12) for detailed error messages
- Look for 🌐, ✅, or ❌ emoji in console logs
- Error toasts explain what went wrong

### For API Questions
Contact Rise-X support and reference:
- Your workspace: `marinestream`
- Environment ID: `e9229623-b98c-5bef-8ee5-024f7e905a4c`

---

## 🎉 You're All Set!

**Open `index.html` and start managing subscriptions!**

The app is designed to be **obvious and fast**. Most workflows take under 2 minutes.

**Common workflow (renewal):** 30 seconds  
**New company setup:** 2 minutes  
**Adding resources:** 1 minute  

---

**Questions?** The interface guides you through each step. **Just try it!** 🚀
