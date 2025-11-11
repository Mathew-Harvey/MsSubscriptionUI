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

**Step 1: Find the User** (30 seconds)

If John from Acme already exists:
```
1. Enter: john@acmecorp.com (or just "john" or "@acmecorp.com")
2. Click "Find Existing User"
3. See John's card appear with his details
4. Click on John's card to select him
5. ✓ His company details auto-fill!
```

If Acme is brand new:
```
1. Enter: john@acmecorp.com
2. Click "Create New User"
3. Click "Find Existing User" (finds the user you just created)
4. Click on John's card
5. ✓ Company created and selected!
```

**Step 2: Create Their Subscription** (90 seconds)

```
1. Company ID & Name are already filled in (from John's card!)
2. Adjust the name if needed: "Acme Corp - Premium"
3. Pick duration: Click "1 Year"
4. Add what they can access:
   • Click "+ Add"
   • Click 🔍 button
   • Type: "Customer Onboarding"
   • Click the workflow from search results
   • Permissions are set to "View, Start" (adjust if needed)
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
1. Search for their user → Click their card
2. Name auto-fills: "[Company] - Premium Access"
3. Adjust to: "[Company] - Basic Package"
4. Duration: 1 Year
5. Search and add the same flows/assets
6. Create Subscription
7. Click "Create Another"
8. Repeat for next customer
```

**Time per customer:** ~90 seconds

### Add More Access to an Existing Customer

**Scenario:** Acme Corp wants access to 2 more workflows

```
1. Search for John: john@acmecorp.com
2. Click John's card
3. Change name to: "Acme Corp - Additional Workflows"
4. Search for the 2 new workflows
5. Create Subscription
```

They now have 2 active subscriptions with different access levels.

### Search for Multiple Users from Same Company

**Scenario:** Acme Corp has 3 employees, you want to check who exists

```
1. Search: @acmecorp.com
2. See all 3 users as cards:
   • John Smith - john@acmecorp.com
   • Sarah Johnson - sarah@acmecorp.com  
   • Mike Davis - mike@acmecorp.com
3. Click any one to create a subscription for their company
```

All users from the same company share the same Company ID.

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

### Search Flexibility
- **Email:** `john@acmecorp.com` - finds exact user
- **Name:** `John Smith` - finds by name
- **Domain:** `@acmecorp.com` - finds all users from that company
- **Partial:** `john` - finds anyone with "john" in name/email

### Multiple Users from Same Company?
- All users from a company (same @domain) share the same Company ID
- Doesn't matter which user you select - subscription applies to the whole company
- Select any user, get the company

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

### About Users & Companies
- **Users** are actual people with email addresses
- **Companies** are created automatically when you add the first user
- All users with the same email domain belong to the same company
  - `john@acme.com` and `sarah@acme.com` = same company
- When you select a user, you're selecting their company
- Creating a subscription for one user = **entire company** gets access

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
