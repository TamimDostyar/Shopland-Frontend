# Product Detail Page

## Access

Public -- no login required to view. Login required to add to cart, wishlist, ask questions, or write reviews.

### URL: `/product/{slug}`

---

## Layout (Top to Bottom)

```
┌────────────────────────────────────────────────────────────────┐
│  [Header: Logo | Search | 🔔 | ❤️ | 🛒 | 👤]                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐  ┌────────────────────────────────────┐  │
│  │                  │  │  Samsung Galaxy A54                │  │
│  │                  │  │                                    │  │
│  │   [Main Image]   │  │  ★★★★☆ 4.2 (128 reviews)         │  │
│  │                  │  │                                    │  │
│  │                  │  │  ̶A̶F̶N̶ ̶2̶5̶,̶0̶0̶0̶                      │  │
│  │                  │  │  AFN 22,000  (12% off)             │  │
│  └──────────────────┘  │                                    │  │
│  [thumb][thumb][thumb]  │  Condition: New                    │  │
│                         │  📍 Kabul, Kabul Province          │  │
│                         │                                    │  │
│                         │  🚚 Estimated delivery:            │  │
│                         │     March 25-27 to Kabul           │  │
│                         │                                    │  │
│                         │  ✅ In Stock (14 available)        │  │
│                         │                                    │  │
│                         │  Quantity: [- 1 +]                 │  │
│                         │                                    │  │
│                         │  [🛒 Add to Cart]                  │  │
│                         │  [❤️ Save to Wishlist]              │  │
│                         │  [↗ Share]                          │  │
│                         └────────────────────────────────────┘  │
│                                                                │
│  ── Seller Info ──────────────────────────────────────────────  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ [Logo] Tech Kabul    ★★★★☆ 4.5 (342 reviews)             ││
│  │        Electronics   Joined March 2026                     ││
│  │        [Visit Shop →]            [💬 Message Seller]       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Description ──────────────────────────────────────────────  │
│  Full product description text...                              │
│  [Read More ▼] (if long)                                      │
│                                                                │
│  ── Questions & Answers ──────────────────────────────────────  │
│  Q: Does this phone support dual SIM?                          │
│  A: Yes, it has dual SIM + microSD slot. — Tech Kabul          │
│                                                                │
│  Q: What's the battery life like?                              │
│  A: Typically lasts 1.5 days with moderate use. — Buyer        │
│                                                                │
│  [Ask a Question]                [See All 12 Questions →]      │
│                                                                │
│  ── Customer Reviews ─────────────────────────────────────────  │
│  ★★★★☆ 4.2 out of 5                                           │
│  128 reviews                                                   │
│  5 ★ ████████████████ 85                                       │
│  4 ★ ████████         42                                       │
│  3 ★ ███              15                                       │
│  2 ★ █                 5                                       │
│  1 ★ █                 3                                       │
│                                                                │
│  [Review Card] [Review Card] [Review Card]                     │
│                              [See All 128 Reviews →]           │
│                                                                │
│  ── Related Products ─────────────────────────────────────────  │
│  [Product Card] [Product Card] [Product Card] [Product Card]   │
│                                                                │
│  [Footer]                                                      │
└────────────────────────────────────────────────────────────────┘
```

---

## Section Details

### Image Gallery

| Element | Details |
|---------|---------|
| Main image | Large, tappable to open fullscreen/lightbox |
| Thumbnails | Row below main image. Tap to change main image |
| Fullscreen/Lightbox | Swipeable gallery with zoom (pinch on mobile) |
| Image count | "1 / 6" indicator in fullscreen |
| Mobile | Full-width swipeable carousel instead of side-by-side layout |

### Price & Discount

| Scenario | Display |
|----------|---------|
| No discount | "AFN 25,000" in large bold text |
| Has discount | Original price struck through + discount price in large bold red + savings percentage badge |
| Currency | Always AFN with ؋ symbol |

### Estimated Delivery

| Element | Details |
|---------|---------|
| Logged in buyer | "Estimated delivery: March 25-27 to {buyer's default city}" |
| Guest | "Estimated delivery: March 25-27 to Kabul" + "Change location" link showing city selector |
| Calculation | Based on product's city/province vs buyer's city/province. Same city: 1-2 days. Same province: 2-4 days. Different province: 4-7 days |
| Not deliverable | "Delivery to {city} not available for this product" (if the seller only ships locally) |

### Stock Status

| State | Display |
|-------|---------|
| In stock (many) | "✅ In Stock" (green) |
| Low stock | "⚠️ Only 3 left" (orange, creates urgency) |
| Out of stock | "❌ Out of Stock" (red). Add to Cart is disabled. Show "Notify Me" button instead |

### Quantity Selector

| Element | Details |
|---------|---------|
| Default | 1 |
| Min / Max | 1 / available stock |
| Buttons | - and + with the number between them |
| Over-max | + button disabled when at max. "Maximum available" tooltip |

### Action Buttons

| Button | Behavior |
|--------|----------|
| Add to Cart | Guest: adds to session cart (localStorage). Logged in: calls API. Shows success toast with "View Cart" link. Button shows spinner during API call |
| Save to Wishlist | Guest: "Log in to save items" prompt. Logged in: toggles wishlist state (filled/unfilled heart). Optimistic UI update |
| Share | Web: copy link button + WhatsApp link + Telegram link. Mobile: native share sheet. Desktop: copy link |

### Seller Info Card

| Element | Details |
|---------|---------|
| Logo + name | Tappable, routes to `/shop/{slug}` |
| Rating | Stars + total reviews |
| Category | "Electronics" |
| "Visit Shop" button | Routes to seller's storefront |
| "Message Seller" button | Opens messaging thread (requires login) |

### Product Description

| Element | Details |
|---------|---------|
| Content | Full description text. Supports basic formatting (paragraphs, lists) |
| Language | Shown in user's preferred language. Fallback to default |
| Truncation | If longer than ~300 chars, truncate with "Read More" toggle |

### Questions & Answers (NEW FEATURE)

| Element | Details |
|---------|---------|
| Display | 2-3 most recent Q&As shown inline |
| "Ask a Question" | Opens a text input. Requires login. Question is sent to seller for response |
| Answers | Seller's answer shown below question. Other buyers can also answer |
| "See All Questions" | Routes to full Q&A page |
| Empty state | "No questions yet. Be the first to ask!" |

### Customer Reviews

| Element | Details |
|---------|---------|
| Summary | Average rating, star breakdown bar chart |
| Recent reviews | 3 most recent review cards |
| "See All Reviews" | Routes to full reviews page |
| "Write a Review" | Only shown if buyer purchased this product. Routes to review form |

### Related Products

| Element | Details |
|---------|---------|
| Data | Products in the same category, excluding the current product |
| Display | Horizontal scroll of product cards |
| Count | 4-8 products |

---

## Mobile Layout Differences

On mobile, the layout changes to a single-column vertical scroll:

```
[Image Carousel - full width, swipeable]
[Product Title]
[Rating]
[Price]
[Delivery Estimate]
[Stock Status]
[Quantity + Add to Cart]     ← sticky at bottom of screen
[Seller Card]
[Description]
[Q&A]
[Reviews]
[Related Products]
```

**Sticky bottom bar on mobile:**

```
┌──────────────────────────────────────────┐
│  [❤️]  [💬]  │   [🛒 Add to Cart - AFN 22,000]   │
└──────────────────────────────────────────┘
```

The Add to Cart button is always visible at the bottom of the screen on mobile, so the buyer never has to scroll back up.

---

## Out-of-Stock Product

When a product is out of stock:

```
┌────────────────────────────────────┐
│  ❌ Currently Out of Stock         │
│                                    │
│  [🔔 Notify Me When Available]     │
│                                    │
│  Save to Wishlist instead? [❤️]    │
└────────────────────────────────────┘
```

"Notify Me" stores the product + user pair. When the seller restocks, the buyer gets a notification.
