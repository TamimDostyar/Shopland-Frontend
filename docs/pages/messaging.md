# Buyer-Seller Messaging

## This Is a New Feature

Not in the original backend docs. Needs a new `apps/messaging/` Django app on the backend.

---

## Why This Feature Matters

In a COD marketplace, trust is the biggest barrier. Buyers need to:
- Ask "Is this product genuine?" before buying
- Ask "Can you ship to my city?" before ordering
- Report issues after delivery ("wrong item received")
- Negotiate for bulk orders

Without in-platform messaging, buyers and sellers would exchange phone numbers -- which is a privacy and safety risk.

---

## How It Works

- All messages go through the platform. No personal contact info is shared.
- Messaging is tied to either a **product** (pre-purchase) or an **order** (post-purchase).
- Sellers are expected to respond within 24 hours. Response time is tracked.
- Supports text messages and image attachments (for showing product issues, etc.).

---

## Screens

### 1. Message Button Locations

The "Message Seller" button appears in three places:

| Location | Context |
|----------|---------|
| Product detail page | "Ask about this product" -- creates a product-linked conversation |
| Order detail page | "Message about this order" -- creates an order-linked conversation |
| Seller storefront | "Contact seller" -- creates a general conversation |

### 2. Inbox / Conversations List

### URL: `/messages`

```
┌────────────────────────────────────────────────────────────────┐
│  Messages                                                      │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  [🟢] Tech Kabul                              2 min ago   ││
│  │  📱 Re: Samsung Galaxy A54                                 ││
│  │  "Yes, it comes with original charger and..."              ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │  [  ] Shoe Palace                             3 hours ago  ││
│  │  📦 Re: Order #SL-20260322-0038                            ││
│  │  "Your order is being packed right now"                    ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │  [🟢] Kabul Electronics                       Yesterday   ││
│  │  💬 General inquiry                                        ││
│  │  "We have those in stock, would you like to..."            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  No more conversations                                         │
└────────────────────────────────────────────────────────────────┘
```

| Element | Details |
|---------|---------|
| Conversation card | Seller/buyer name, context (product/order/general), last message preview, timestamp |
| Unread indicator | Green dot on unread conversations |
| Context icon | 📱 product question, 📦 order issue, 💬 general |
| Sort | Most recent first |
| Tap | Opens the conversation |

### 3. Conversation / Chat View

### URL: `/messages/{conversationId}`

```
┌────────────────────────────────────────────────────────────────┐
│  ← Messages      Tech Kabul                     [ℹ️ Details]  │
│  ──────────────────────────────────────────────────────────── │
│  📱 About: Samsung Galaxy A54  [View Product →]               │
│  ──────────────────────────────────────────────────────────── │
│                                                                │
│                                           ┌─────────────────┐ │
│                                           │ Hi, does this    │ │
│                                           │ phone come with  │ │
│                                           │ a charger?       │ │
│                                           │        10:30 AM ✓│ │
│                                           └─────────────────┘ │
│                                                                │
│  ┌─────────────────┐                                           │
│  │ Yes! It comes    │                                          │
│  │ with the original│                                          │
│  │ Samsung charger  │                                          │
│  │ and a free case. │                                          │
│  │ 10:45 AM         │                                          │
│  └─────────────────┘                                           │
│                                                                │
│                                           ┌─────────────────┐ │
│                                           │ Great! And can   │ │
│                                           │ you deliver to   │ │
│                                           │ Herat?           │ │
│                                           │        10:46 AM ✓│ │
│                                           └─────────────────┘ │
│                                                                │
│  ┌─────────────────┐                                           │
│  │ Yes, delivery to │                                          │
│  │ Herat takes 5-7  │                                          │
│  │ days. Fee is 800  │                                         │
│  │ AFN.              │                                         │
│  │ 11:02 AM          │                                         │
│  └─────────────────┘                                           │
│                                                                │
│  ┌──────────────────────────────────────────┐  [📎]  [Send →] │
│  │  Type a message...                       │                  │
│  └──────────────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────┘
```

| Element | Details |
|---------|---------|
| Header | Other party's name, back button, info button |
| Context bar | What this conversation is about (product link or order number). Tappable |
| Messages | Chat bubbles. Buyer on right (colored), seller on left (gray) |
| Timestamps | Below each message or grouped by time |
| Read receipts | ✓ sent, ✓✓ read (optional) |
| Image attachment | 📎 button to attach photos (max 5MB, JPG/PNG) |
| Send button | Disabled when input is empty |
| Loading | Show "..." typing indicator when other party is typing (future, via WebSocket) |

### 4. Chat Details Panel

Accessible via the ℹ️ button in the conversation header.

```
┌────────────────────────────────┐
│  Conversation Details          │
│                                │
│  With: Tech Kabul              │
│  About: Samsung Galaxy A54     │
│  Started: March 23, 2026       │
│                                │
│  [View Product]                │
│  [View Seller's Shop]          │
│  [Report This Seller]          │
│  [Block Seller]                │
└────────────────────────────────┘
```

---

## Seller's Messaging View

Sellers see the same inbox but from their side. Their dashboard has a "Messages" tab with unread count badge.

Additional seller features:
- **Quick replies:** Pre-saved responses like "Item is in stock", "We ship nationwide", "Delivery takes 3-5 days"
- **Response time metric:** Dashboard shows average response time
- **Mark as spam:** Flag suspicious buyer messages

---

## Backend Requirements (New)

This feature needs a new `apps/messaging/` app on the backend:

### Models

| Model | Fields |
|-------|--------|
| `Conversation` | id, buyer (FK), seller (FK), product (FK nullable), order (FK nullable), type (product/order/general), created_at, updated_at |
| `Message` | id, conversation (FK), sender (FK), body (text), image (ImageField nullable), is_read, created_at |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/messages/conversations/` | GET | List conversations |
| `/api/messages/conversations/` | POST | Start a new conversation |
| `/api/messages/conversations/{id}/` | GET | Get conversation with messages |
| `/api/messages/conversations/{id}/messages/` | POST | Send a message |
| `/api/messages/conversations/{id}/read/` | POST | Mark messages as read |

### Real-Time (Future)

For live chat experience, add WebSocket support via Django Channels:
- Connect on conversation page open
- Receive new messages instantly
- Show typing indicators
- Disconnect on page leave

For launch, polling every 5-10 seconds is acceptable.

---

## Access Rules

| Rule | Details |
|------|---------|
| Must be logged in | Guests cannot message |
| Buyer must be phone-verified | Prevents spam from unverified accounts |
| Seller must be approved | Only active sellers can receive messages |
| Messages expire | Cannot send messages about orders older than 30 days |
| No external links | Messages with URLs are flagged/blocked (prevents scam links) |
| No phone numbers | Messages containing phone number patterns are warned/blocked |

---

## Notification Integration

| Event | Notification |
|-------|-------------|
| New message received | Push notification (mobile), browser notification (web), in-app bell |
| Message content | "{Seller Name}: {first 50 chars of message}" |
| Unread badge | Show unread count on Messages tab and notification bell |
