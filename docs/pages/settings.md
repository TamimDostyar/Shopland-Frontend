# Settings & Preferences

## Access

Requires login.

### URL: `/settings`

---

## Layout

```
┌────────────────────────────────────────────────────────────────┐
│  ← Profile              Settings                               │
│                                                                │
│  ── Account ──────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Change Email                              tamim@email.com ││
│  │  Change Phone Number                      +93 70 *** **67 ││
│  │  Change Password                                    ••••• ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Preferences ──────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Language                                     [Dari    ▼] ││
│  │  Default City                                 [Kabul   ▼] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Notifications ────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Order Updates                                    [ON ●]  ││
│  │  Messages                                         [ON ●]  ││
│  │  Price Drop Alerts                                [ON ●]  ││
│  │  Back-in-Stock Alerts                             [ON ●]  ││
│  │  Promotional Notifications                        [OFF ○] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Seller Notifications (sellers only) ──────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  New Order Alerts                                 [ON ●]  ││
│  │  New Review Alerts                                [ON ●]  ││
│  │  Low Stock Alerts                                 [ON ●]  ││
│  │  New Message Alerts                               [ON ●]  ││
│  │  Settlement Notifications                         [ON ●]  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Privacy ──────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Download My Data                              [Request]  ││
│  │  Delete Account                                [Delete]   ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── About ────────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  App Version                                      1.0.0   ││
│  │  Terms of Service                                    →     ││
│  │  Privacy Policy                                      →     ││
│  │  Help Center                                         →     ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                    [Log Out]                                ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Section Details

### Account Changes

| Action | Flow |
|--------|------|
| Change Email | Opens form with new email + password confirmation. Sends verification to new email. Old email stays active until new one is verified |
| Change Phone | Opens form with new phone + SMS verification. Old phone stays active until new one is verified |
| Change Password | Opens form with current password + new password + confirm new password |

### Language Preference

| Language | Code |
|----------|------|
| Dari (دری) | `fa` |
| Pashto (پښتو) | `ps` |
| English | `en` |

Changes the UI language immediately. Persisted to backend user profile and localStorage.

### Default City

Used for:
- "Products near you" on the home page
- Delivery estimates on product pages (for guests who later log in)
- Search relevance

### Notification Toggles

Stored on the backend. Toggles are switches -- tap to toggle on/off. Some notifications (order updates, messages) cannot be disabled because they're critical.

### Privacy Actions

| Action | Details |
|--------|---------|
| Download My Data | Requests a data export. Backend generates a JSON/ZIP of all user data. Notification when ready for download |
| Delete Account | Confirm dialog with password entry. "This action is permanent. All your data will be deleted within 30 days." Requires typing "DELETE" to confirm. Calls DELETE endpoint, logs user out |

### Log Out

Calls `POST /api/users/logout/` to blacklist the refresh token, clears all tokens from storage, routes to home page.

---

## Mobile-Specific

On mobile, Settings is accessed from the Profile tab. The layout uses native-feeling grouped rows (like iOS Settings or Android Material Design lists).
