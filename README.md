# MarineStream Subscription Manager

> Give your customers access to specific workflows and assets in minutes, not hours.

A beautifully simple app for managing who can access what in MarineStream. No technical knowledge required.

---

## What Does This Do?

Let's say **Acme Corporation** just signed up. You want to give them access to:
- The "Customer Onboarding" workflow
- The "Reports Dashboard" workflow  
- The "Customer Database" asset

**This app lets you do that in 2 minutes.** ⏱️

---

## Quick Start (60 Seconds)

### First Time Setup

1. **Open** `index.html` in any browser (Chrome recommended)
2. **Click "Settings"** (top right corner)
3. **Paste your API key** (see below for how to get it)
4. **Click "Save & Connect"**
5. **You're ready!** ✓

### Getting Your API Key

Your API key lets this app talk to MarineStream on your behalf.

**Here's how to get it:**

1. Open `app.marinestream.io` in Chrome
2. Log in with your credentials
3. Press **F12** on your keyboard
4. Click the **"Network"** tab at the top
5. Refresh the page (**F5**)
6. Click any request in the list
7. Click **"Headers"** on the right side
8. Scroll down to find `Authorization: Bearer ey...`
9. Copy **only** the part after "Bearer " (starts with "ey")
10. Paste it into Settings in this app

**Important:** Don't copy the word "Bearer", just the long token after it!

**Note:** Keys expire after 30 minutes. Just grab a fresh one when needed (takes 10 seconds).

---

## How to Give a Company Access

### Example: Adding "Acme Corporation"

**Step 1: Find Their Company** (30 seconds)

```
1. Enter any employee's email: john@acmecorp.com
2. Click "Find Company"
3. ✓ Company ID appears automatically
```

If Acme is brand new:
```
1. Enter: john@acmecorp.com
2. Click "Create New User"
3. Click "Find Company"
4. ✓ Company created and found!
```

**Step 2: Create Their Subscription** (90 seconds)

```
1. Company ID is already filled in (from Step 1)
2. Enter a name: "Acme Corp - Premium"
3. Pick duration: Click "1 Year"
4. Add what they can access:
   • Click "+ Add"
   • Click 🔍 button
   • Search "Customer Onboarding"
   • Click it to select
   • Permissions default to "View, Start" (change if needed)
   • Repeat for more flows/assets
5. Click "Create Subscription"
6. ✓ Done! Acme can now access those workflows.
```

**Total time: ~2 minutes** 🚀

---

## Key Features

### 🔍 Search Flows & Assets by Name
- No need to remember UUIDs or IDs
- Just type the name: "Customer" → see all matches
- Click to select → ID filled automatically
- Works for both flows and assets

### 📧 Work with Emails, Not IDs
- Enter emails you know
- Company IDs are handled behind the scenes
- Copy/paste between steps automatically

### 🎨 Clean & Simple Interface
- Apple-inspired design
- Two clear steps
- No clutter or confusion
- Works on any device

### ⚡ Fast & Efficient
- Auto-fills data between steps
- Real-time search
- One-click selections
- Get things done quickly

---

## Common Tasks

### Give Multiple Companies the Same Access

**Scenario:** You have 5 new customers who all get the same "Basic Package"

```
For each customer:
1. Enter their email → Find Company
2. Name: "[Company] - Basic Package"
3. Duration: 1 Year
4. Search and add the same flows/assets
5. Create Subscription
6. Repeat for next customer
```

**Time per customer:** ~90 seconds

### Add More Access to an Existing Customer

**Scenario:** Acme Corp wants access to 2 more workflows

```
1. Find their company: john@acmecorp.com
2. Create new subscription: "Acme Corp - Additional Access"
3. Search for the 2 new workflows
4. Create Subscription
```

They now have 2 active subscriptions with different access levels.

### Create a User for a New Company

**Scenario:** Brand new company "NewCo Inc" with user sarah@newco.com

```
1. Enter: sarah@newco.com
2. Click "Create New User"
3. Click "Find Company"
4. Create subscription as normal
```

The company is created automatically when you create the first user.

---

## Troubleshooting

### "Connection blocked" or CORS errors

**Problem:** Your browser blocks the connection to the API.

**Solution:**
1. Open Terminal/Command Prompt
2. Navigate to this folder
3. Run: `node proxy-server.js`
4. In Settings, change API Address to: `http://localhost:3000`
5. Save and try again

### "No company found"

**Problem:** The user doesn't exist yet.

**Solution:**
- Click "Create New User" first
- Then click "Find Company"

### "API key not configured"

**Problem:** You haven't set up your API key yet.

**Solution:**
- Click "Settings"
- Follow the steps above to get your API key
- Paste it in and save

### Search returns no results

**Problem:** The flow/asset name might not match exactly.

**Solution:**
- Try partial names (e.g., "customer" instead of "Customer Onboarding Workflow")
- Try different keywords
- Check the MarineStream admin panel for the exact name

---

## Tips & Tricks

### Copy the Company ID
- Click the "Copy ID" button in Step 1
- It's on your clipboard, ready to paste anywhere

### Quick Permissions
- Most common: `View, Start`
- Full access: `View, Start, Edit, Delete`
- Read-only: `View`

### Duration Shortcuts
- Testing: 1 Month
- Trial: 3 Months
- Standard: 1 Year
- Enterprise: 2 Years

### Search Tips
- Search is case-insensitive
- Partial matches work ("cust" finds "Customer Onboarding")
- Results show both flows AND assets together

---

## What You Need to Know

### About Companies
- Companies are created automatically when you add a user
- All users with the same email domain (e.g., @acmecorp.com) belong to the same company
- You find companies by searching for any user's email from that company

### About Subscriptions
- One company can have multiple subscriptions
- Each subscription defines what flows/assets they can access
- Subscriptions have an expiration date (duration)
- You can create different subscriptions for different access levels

### About Flows & Assets
- **Flows** = Workflows/processes they can run
- **Assets** = Data/files they can access
- You search by name, we handle the IDs
- Permissions define what they can do (View, Start, Edit, Delete, Create)

---

## That's All You Need!

This app is designed to be **obvious and easy**. If you can use an iPhone, you can use this.

**Questions?** Read `HOW_TO_USE.md` for detailed instructions.

**Need help?** Everything you do is logged to the browser console (F12) for troubleshooting.

---

**Ready to start?** Open `index.html` and give someone access to MarineStream! 🚀
