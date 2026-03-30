# Home Page

## Access

Public -- no login required. This is the first page every visitor sees.

---

## Layout (Top to Bottom)

### Header (sticky, always visible)

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]   [────── Search bar ──────] [🔔] [❤️] [🛒 3]  [👤] │
└────────────────────────────────────────────────────────────┘
```

| Element | Details |
|---------|---------|
| Logo | "Amazebid" logo, taps to reload home |
| Search bar | Placeholder: "Search products..." Click to expand with autocomplete |
| Notification bell (🔔) | Badge with unread count. Logged-in only (hidden for guests) |
| Wishlist heart (❤️) | Routes to wishlist. Logged-in only (hidden for guests) |
| Cart icon (🛒) | Badge with item count. Works for guests too (session cart) |
| Profile icon (👤) | Logged in: shows avatar, taps to profile. Guest: shows "Log In" button |

**Mobile header:** Compact. Search bar collapses to an icon, tapping opens full-screen search. Bottom tab bar replaces some header icons.

### Mobile Bottom Tab Bar

```
┌──────────────────────────────────────────┐
│  [Home]  [Categories]  [Cart]  [Orders]  [Profile] │
└──────────────────────────────────────────┘
```

For guests, "Orders" shows login prompt when tapped. "Profile" shows login/register options.

---

### Category Bar

Horizontal scrollable row of top-level categories with icons.

```
[ 📱 Electronics ] [ 👕 Clothing ] [ 🍎 Food ] [ 🏠 Home ] [ 📚 Books ] [ ⋯ All ]
```

| Element | Details |
|---------|---------|
| Category chip | Icon + name (in user's language) |
| Scroll | Horizontal, no wrapping. Shows 4-5 on screen, swipe for more |
| "All Categories" | Last item, routes to full category tree page |
| Tap | Routes to category page with products |

---

### Hero Banner / Promotions (optional)

A carousel of promotional banners at the top.

| Element | Details |
|---------|---------|
| Banner images | Full-width, auto-rotating every 5 seconds |
| Dots indicator | Shows which banner is active |
| Tap | Routes to a deal page, category, or product |

This section is optional for launch -- can be a static welcome banner initially.

---

### Recently Viewed (if applicable)

Only shown if the user has browsed products before (tracked in localStorage).

```
Recently Viewed
[Product] [Product] [Product] [Product] → See All
```

| Element | Details |
|---------|---------|
| Section title | "Recently Viewed" |
| Product cards | Horizontal scroll, small cards (image + name + price) |
| Max items | Last 10-15 viewed products |
| "See All" link | Routes to a page with the full recently-viewed list |
| Storage | Product IDs + timestamps in localStorage (no backend needed) |

---

### Products Near You

Shown if the user is logged in and has a default address, OR if the guest has selected a city.

```
Products in Kabul
[Product Card] [Product Card] [Product Card] [Product Card]
                                                    See All →
```

| Element | Details |
|---------|---------|
| Section title | "Products in {city}" |
| Data | `GET /api/catalog/products/?city={city}&sort=newest&limit=8` |
| Guest behavior | Show a city selector: "Where are you shopping? [Select city ▼]" |
| Product cards | Standard card (image, name, price, seller, rating) |

---

### Featured / Popular Products

```
Popular Products
[Product Card] [Product Card] [Product Card] [Product Card]
[Product Card] [Product Card] [Product Card] [Product Card]
                                                    See All →
```

| Element | Details |
|---------|---------|
| Data | `GET /api/catalog/products/?sort=most_viewed&limit=8` |
| Layout | 2x4 grid on web, 2-column grid on mobile |

---

### Newest Arrivals

```
Just Added
[Product Card] [Product Card] [Product Card] [Product Card]
                                                    See All →
```

| Element | Details |
|---------|---------|
| Data | `GET /api/catalog/products/?sort=newest&limit=8` |
| Layout | Horizontal scroll or grid |

---

### Browse by Category (visual grid)

Larger visual category cards for exploration.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  [Image]    │  │  [Image]    │  │  [Image]    │
│ Electronics │  │  Clothing   │  │  Home &     │
│             │  │             │  │  Kitchen    │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

### Footer (web/desktop only)

```
┌────────────────────────────────────────────────────────────┐
│  About Amazebid  │  Help & FAQ   │  Sell on Amazebid       │
│  Terms of Service│  Contact Us   │  Privacy Policy          │
│                                                             │
│  Language: [Dari ▼]                          © 2026 Amazebid│
└────────────────────────────────────────────────────────────┘
```

Mobile: footer links are in the Settings/Profile section instead.

---

## Guest vs Logged-In Differences

| Element | Guest | Logged In |
|---------|-------|-----------|
| Search | Works fully | Works fully |
| Categories | Works fully | Works fully |
| Product detail | Works fully | Works fully |
| Add to cart | Session cart (localStorage) | Server cart |
| Wishlist icon | Hidden or "Log in to save" | Shows heart with count |
| Notifications | Hidden | Shows bell with badge |
| Profile icon | "Log In / Register" | Avatar + dropdown |
| "Products near you" | City selector shown | Uses default address city |
| Recently viewed | Works (localStorage) | Works (localStorage) |
| Cart badge | Session cart count | Server cart count |

**Session cart merge on login:** When a guest has items in localStorage cart and logs in, the frontend should call `POST /api/cart/items/` for each session cart item to merge them into the server cart, then clear localStorage cart.

---

## Loading States

| Section | Loading state |
|---------|--------------|
| Category bar | Skeleton: 5 gray rounded rectangles |
| Product grids | Skeleton: 4-8 gray product card placeholders |
| Hero banner | Gray rectangle with shimmer animation |
| Full page | Never show a blank page -- load sections independently |

---

## Empty States

| Scenario | Display |
|----------|---------|
| No products in city | "No products available in {city} yet. Browse all products instead." |
| No recently viewed | Section is hidden (not shown at all) |
| API error | "Something went wrong. Pull to refresh." with retry button |
