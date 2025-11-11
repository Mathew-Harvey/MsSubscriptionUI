# 👁️ View Current Access Feature

## What Is This?

When you select a user, the app **automatically shows you** what subscriptions and access permissions that company currently has.

**Why this matters:**
- ✅ See what they already have before adding more
- ✅ Avoid creating duplicate subscriptions
- ✅ Check expiry dates
- ✅ Understand their current access level

---

## How It Works

### When You Select a User

After clicking a user card, you see:

```
┌─ ✓ User Selected ────────────────────────────┐
│ User: John Smith                             │
│ Email: john@acmecorp.com                     │
│ Company: Acmecorp                            │
│ Company ID: abc-123-xyz-789                  │
│ ──────────────────────────────────────────   │
│ CURRENT ACCESS                    Loading... │
│                                               │
│ ┌─────────────────────────────────────────┐  │
│ │ Acmecorp - Premium        [Active]      │  │
│ │ Expires: 12/31/2025                     │  │
│ │ ─────────────────────────────────────   │  │
│ │ 🔄 Customer Onboarding    View, Start   │  │
│ │ 🔄 Reports Dashboard      View, Start   │  │
│ │ 📦 Customer Database      View, Create  │  │
│ └─────────────────────────────────────────┘  │
│                                               │
│ ┌─────────────────────────────────────────┐  │
│ │ Acmecorp - Trial          [Expired]     │  │
│ │ Expired: 6/30/2024                      │  │
│ │ ─────────────────────────────────────   │  │
│ │ 🔄 Basic Workflow         View          │  │
│ └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

---

## What You See

### For Each Subscription

**Header:**
- Subscription name
- Status badge (Active, Expired, Archived)

**Details:**
- Expiry date or expiration notice

**Resources:**
- 🔄 = Flow/Workflow
- 📦 = Asset
- Resource name
- Permissions they have

---

## Real-World Examples

### Example 1: Acme Has No Subscriptions Yet

```
Select John from Acme Corp
      ↓
CURRENT ACCESS
┌────────────────────────────────────────────┐
│ No active subscriptions yet.               │
│ This will be their first!                  │
└────────────────────────────────────────────┘
```

**Perfect!** You can confidently create their first subscription.

---

### Example 2: Acme Already Has Access

```
Select Sarah from Acme Corp
      ↓
CURRENT ACCESS
┌────────────────────────────────────────────┐
│ Acmecorp - Basic Package    [Active]      │
│ Expires: 12/31/2025                       │
│ ──────────────────────────────────────    │
│ 🔄 Main Workflow          View, Start     │
│ 🔄 Customer Workflow      View, Start     │
└────────────────────────────────────────────┘
```

**You see:** They already have 2 workflows.

**You think:** "Should I add more workflows, or extend the existing subscription?"

**You decide:** Create new subscription "Acmecorp - Advanced Features" with additional workflows they don't have yet.

---

### Example 3: Multiple Subscriptions

```
Select Mike from Acme Corp
      ↓
CURRENT ACCESS
┌────────────────────────────────────────────┐
│ Acmecorp - Basic          [Active]        │
│ Expires: 12/31/2025                       │
│ 🔄 Main Workflow          View, Start     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Acmecorp - Reports        [Active]        │
│ Expires: 6/30/2025                        │
│ 🔄 Reports Dashboard      View, Edit      │
│ 📦 Analytics Database     View, Create    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Acmecorp - Trial          [Expired]       │
│ Expired: 3/15/2024                        │
│ 🔄 Demo Workflow          View            │
└────────────────────────────────────────────┘
```

**You see:** 
- 2 active subscriptions
- 1 expired subscription
- Total access: Main Workflow, Reports Dashboard, Analytics Database

**You think:** "They need access to Customer Onboarding workflow"

**You do:** Create new subscription with just that one workflow, since they already have the others.

---

## Benefits

### ✅ Avoid Duplicates
Don't accidentally give them access to the same workflow twice!

### ✅ See Expiry Dates
Know when their access expires. Maybe you're just renewing existing access?

### ✅ Understand Access Levels
See if they have Basic, Premium, Trial, etc. - helps you decide what to add.

### ✅ Quick Reference
All their access in one glance before you make changes.

---

## Status Indicators

### Active (Green Badge)
- Subscription is currently working
- They have access to these resources right now

### Expired (Gray Badge)
- Subscription has passed its end date
- They no longer have access
- You might want to renew it!

### Archived (Dark Gray Badge)
- Subscription was manually disabled
- No longer active

---

## API Details

When you select a user, the app calls:

```
GET /api/v3/subscription?companyId={companyId}
```

This returns all subscriptions for that company, including:
- Display name
- Status
- Expiry dates
- Resources (flows/assets)
- Permissions per resource

We display it in a clean, scannable format so you can quickly understand their current access.

---

## Use Cases

### Before Creating a Subscription

**Scenario:** Customer calls and says "We can't access the Reports workflow!"

**Old way:**
- Create subscription blindly
- Maybe they already have it?
- Confusion!

**New way:**
1. Search for their user
2. Select them
3. See current access
4. "Oh, they have Reports but it expired 2 months ago"
5. Renew their Reports subscription with correct dates

---

### Audit What a Company Has

**Scenario:** Boss asks "What does Acme Corp currently have access to?"

**Old way:**
- Check multiple systems
- Log into admin panel
- Search through logs

**New way:**
1. Search: @acmecorp.com
2. Click any Acme user
3. See complete list of all subscriptions and resources
4. Screenshot or note it down
5. Done in 10 seconds!

---

### Plan Renewals

**Scenario:** You need to renew subscriptions for 5 companies

**New way:**
1. Search first company user
2. See what they have + expiry dates
3. Note which ones expire soon
4. Create renewal subscriptions
5. Repeat for next company

**Time saved:** Tons. You see everything in one place.

---

## Summary

**You asked:** "Can we view current access for the selected user?"

**You got:** 
- ✅ Automatic loading when user selected
- ✅ Shows all active, expired, and archived subscriptions
- ✅ Lists every flow/asset they can access
- ✅ Shows permissions per resource
- ✅ Color-coded status badges
- ✅ Clean, scannable layout

**Result:** You always know what you're working with before making changes. No surprises! 🎯

