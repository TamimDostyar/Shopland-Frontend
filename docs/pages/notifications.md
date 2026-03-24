# Notification Center

## This Is a New Feature

Not in the original backend docs. Needs a new `apps/notifications/` Django app on the backend.

---

## How It Works

Every important event generates a notification. Notifications are delivered through:

1. **In-app notification center** -- bell icon with badge, dropdown/page with notification list
2. **Push notifications** -- mobile (via Expo push), desktop (via Electron system notification)
3. **Browser notifications** -- web (with permission prompt)

---

## Bell Icon (Global Header)

```
[🔔 5]   ← badge with unread count
```

| Element | Details |
|---------|---------|
| Location | Header, always visible for logged-in users |
| Badge | Red circle with unread count. Hidden when 0 |
| Tap (web/desktop) | Opens notification dropdown panel |
| Tap (mobile) | Routes to full notification page |

---

## Notification Dropdown (Web/Desktop)

```
                    ┌──────────────────────────────┐
                    │  Notifications        Mark All│
                    │                       as Read │
                    │  ┌──────────────────────────┐│
                    │  │🟢 Your order #0042 has    ││
                    │  │been accepted by the seller││
                    │  │                  2 min ago ││
                    │  └──────────────────────────┘│
                    │  ┌──────────────────────────┐│
                    │  │🟢 New message from        ││
                    │  │Tech Kabul: "Yes, it       ││
                    │  │comes with..."             ││
                    │  │                 15 min ago ││
                    │  └──────────────────────────┘│
                    │  ┌──────────────────────────┐│
                    │  │   Price drop! Samsung     ││
                    │  │   A54 is now AFN 22,000   ││
                    │  │                 1 hour ago ││
                    │  └──────────────────────────┘│
                    │                              │
                    │    [See All Notifications →]  │
                    └──────────────────────────────┘
```

| Element | Details |
|---------|---------|
| Max items | 5-7 most recent |
| Unread | Green dot + slightly darker background |
| Read | No dot, normal background |
| Tap | Routes to the relevant page (order, message, product) |
| "Mark All as Read" | Marks all as read, clears badge |
| "See All" | Routes to full notifications page |

---

## Full Notifications Page

### URL: `/notifications`

```
┌────────────────────────────────────────────────────────────────┐
│  Notifications                           [Mark All as Read]    │
│                                                                │
│  Today                                                         │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 📦 Order Update                                   2 min ago││
│  │ Your order #SL-20260323-0042 has been accepted by          ││
│  │ the seller and is being prepared.                          ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 💬 New Message                                  15 min ago ││
│  │ Tech Kabul: "Yes, it comes with the original               ││
│  │ charger and a free case."                                  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  Yesterday                                                     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 💰 Price Drop                                   Yesterday  ││
│  │ Samsung Galaxy A54 on your wishlist dropped                ││
│  │ from AFN 25,000 to AFN 22,000!                             ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ✅ Identity Verified                            Yesterday  ││
│  │ Your identity has been verified. You now have               ││
│  │ full access to Shopland.                                   ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  Earlier                                                       │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 📱 Phone Verified                             Mar 21, 2026││
│  │ Your phone number has been verified.                       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

Grouped by date: Today, Yesterday, Earlier. Each notification is tappable and routes to the relevant page.

---

## Notification Types

### Buyer Notifications

| Type | Icon | Message | Routes to |
|------|------|---------|-----------|
| Order placed | 📦 | "Order #{number} placed successfully" | Order detail |
| Order accepted | 📦 | "Your order #{number} has been accepted" | Order detail |
| Order rejected | ❌ | "Your order #{number} was rejected: {reason}" | Order detail |
| Order preparing | 📦 | "Your order is being prepared" | Order detail |
| Out for delivery | 🚚 | "Your order is on its way!" | Order detail (tracking) |
| Delivered | ✅ | "Your order has been delivered. Confirm receipt?" | Order detail |
| New message | 💬 | "{seller}: {preview}" | Conversation |
| Price drop (wishlist) | 💰 | "{product} price dropped to AFN {price}" | Product page |
| Back in stock (wishlist) | 📦 | "{product} is back in stock!" | Product page |
| Phone verified | ✅ | "Your phone number has been verified" | Home |
| Email verified | ✅ | "Your email has been verified" | Home |
| ID verified | ✅ | "Your identity has been verified" | Home |
| ID rejected | ❌ | "Your ID verification was rejected: {reason}" | Profile |
| Q&A answered | 💬 | "Your question about {product} was answered" | Product page |

### Seller Notifications

| Type | Icon | Message | Routes to |
|------|------|---------|-----------|
| New order | 🔔 | "New order #{number} received!" | Seller order detail |
| Order cancelled | ❌ | "Order #{number} was cancelled by buyer" | Seller order detail |
| New message | 💬 | "{buyer}: {preview}" | Conversation |
| Product approved | ✅ | "{product} has been approved and is now live" | Seller products |
| Product rejected | ❌ | "{product} was rejected: {reason}" | Seller products |
| New review | ⭐ | "New {rating}-star review on {product}" | Seller reviews |
| Low stock | ⚠️ | "{product} is running low (only {count} left)" | Seller inventory |
| New question | ❓ | "New question on {product}: {preview}" | Product Q&A |
| Seller approved | ✅ | "Your seller account has been approved!" | Seller dashboard |
| Seller rejected | ❌ | "Your seller application was rejected: {reason}" | Profile |
| Settlement completed | 💰 | "Settlement of AFN {amount} has been processed" | Seller earnings |

---

## Backend Requirements

### Models

| Model | Fields |
|-------|--------|
| `Notification` | id, user (FK), type (choice), title, body, data (JSONField for routing info), is_read, created_at |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications/` | GET | List notifications (paginated, newest first) |
| `/api/notifications/unread-count/` | GET | Get unread count (for badge) |
| `/api/notifications/{id}/read/` | POST | Mark one as read |
| `/api/notifications/read-all/` | POST | Mark all as read |

### Push Notification Service

- Mobile: Expo push notifications (register device token on login)
- Web: Browser Push API (request permission, register service worker)
- Desktop: Electron notification API

The backend creates a `Notification` record AND sends a push notification to the user's registered devices.

---

## Notification Preferences

In Settings (`/settings`), users can control which notifications they receive:

| Category | Toggle |
|----------|--------|
| Order updates | On (cannot disable) |
| Messages | On (cannot disable) |
| Price drop alerts | On/Off |
| Back-in-stock alerts | On/Off |
| New review notifications (seller) | On/Off |
| Low stock alerts (seller) | On/Off |
| Promotional notifications | On/Off |
