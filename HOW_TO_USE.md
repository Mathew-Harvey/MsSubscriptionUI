# 🚀 How to Use MarineStream Subscription Manager

## First Time Setup (30 seconds)

1. **Open the app** in your browser
2. **Click "Settings"** in the top right
3. **Paste your API key** (see below how to get it)
4. **Click "Save & Connect"**
5. **Done!** ✓

---

## Getting Your API Key (One Time)

1. Go to `app.marinestream.io` and log in
2. Press **F12** (opens Developer Tools)
3. Click **Network** tab
4. Refresh the page (**F5**)
5. Click any request in the list
6. Click **Headers** tab on the right
7. Scroll to find `Authorization: Bearer ey...`
8. Copy **only the part after "Bearer "** (starts with "ey")
9. Paste into Settings in the app

**Key expires in 30 minutes** - just refresh it by copying a new one when needed.

---

## Adding a Subscription (2 Minutes)

### Step 1: Find the User (30 seconds)

**If it's a NEW customer:**
1. Enter their email: `sarah@newcompany.com`
2. Click **"Create New User"**
3. Click **"Find Existing User"**
4. See Sarah's user card appear
5. Click on her card to select
6. ✓ Company details auto-fill into Step 2!
7. See their **current subscriptions** and what access they already have

**If they ALREADY exist:**
1. Enter their email (or just name, or company domain)
2. Click **"Find Existing User"**
3. See all matching users as cards
4. Click the one you want
5. ✓ Company details auto-fill into Step 2!
6. See their **current subscriptions** - know what they already have access to

---

### Step 2: Create Subscription (90 seconds)

1. **Company ID** auto-fills (or click "Use ID from Step 1")
2. **Enter a name:** `Acme Corp - Premium Access`
3. **Pick duration:** Click 1 Month, 3 Months, 1 Year, or 2 Years
4. **Add resources:**
   - Click **"+ Add"** to add a row
   - Go to **MarineStream admin panel**
   - Find the flow or asset you want to grant access to
   - **Copy its resource ID** (the UUID)
   - **Paste** it into the resource field
   - Adjust **Permissions** if needed: `View, Start, Edit`
   - Repeat for each flow/asset you want to grant access to
5. **Click "Create Subscription"**
6. ✓ **Done!** They now have access.

---

## Example: Give Acme Corp Access to 2 Workflows

### Step 1
```
Search: john@acmecorp.com
→ Click "Find Existing User"
→ See John's card:
   ┌─────────────────────────────┐
   │ John Smith          [USER]  │
   │ john@acmecorp.com           │
   │ Company: Acmecorp           │
   │ Company ID: abc-123...      │
   └─────────────────────────────┘
→ Click on the card
→ ✓ Selected! Details appear below
```

### Step 2
```
Company ID: abc-123-xyz-789 [auto-filled from John's card!]
Name: Acmecorp - Premium Access [auto-suggested!]
Duration: 1 Year (click the pill)

Resources:
  Row 1:
    Type: Flow
    ID: df596c86-ee83-6aa4-bf62-1e46f847cf9a (paste from MarineStream)
    Permissions: View, Start

  Row 2:
    Type: Flow
    ID: 3eaf98b4-8995-644e-bf6a-2bc3aec1fd7b (paste from MarineStream)
    Permissions: View, Start, Edit

→ Click "Create Subscription"
→ ✓ Success!
```

**Total time: ~2 minutes**

---

## Tips

### See Current Access
- When you select a user, their current subscriptions appear automatically
- See what flows/assets they already have access to
- Check expiry dates
- Helps you avoid creating duplicate access

### Getting Resource IDs
- Open **MarineStream admin panel** in another tab
- Navigate to flows or assets
- Find the one you want to grant access to
- **Copy the resource ID** (looks like a UUID)
- **Paste** it into the app
- The app displays shortened IDs (first 8 chars) for easier reading

### Common Permissions
- **Flows:** `View, Start, Edit, Delete`
- **Assets:** `View, Create, Edit, Delete`
- Mix and match as needed!

### Multiple Resources
- Click **"+ Add"** to add more rows
- Give access to multiple flows/assets in one subscription
- Click **✕** to remove a row

---

## Troubleshooting

### "Connection blocked"
- Start the proxy: `node proxy-server.js`
- In Settings, change API Address to: `http://localhost:3000`

### "No company found"
- Make sure you clicked "Create New User" first
- Double-check the email address is correct

### "API key not configured"
- Click Settings and paste your API key
- Make sure you copied just the token (starts with "ey"), not "Bearer"

---

## That's All You Need to Know!

The app is designed to be simple and obvious. If you can use an iPhone, you can use this app.

**Questions?** The interface tells you what to do at each step.

