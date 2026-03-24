# Wishlist / Saved Items

## This Is a New Feature

Not in the original backend docs. Needs a new model on the backend (can be added to `apps/users/` or a new `apps/wishlist/` app).

---

## How It Works

- Buyers can save any product to their wishlist from the product page or product card
- Wishlist persists across sessions (server-side for logged-in users)
- "Save for Later" in the cart moves items to the wishlist
- Buyers can move wishlist items back to the cart

---

## Heart Icon Behavior

The heart (❤️) button appears in two places:

### On Product Cards (in listings, search, category pages)

| State | Display |
|-------|---------|
| Not saved | Outlined heart (🤍) in top-right corner of card |
| Saved | Filled red heart (❤️) |
| Guest tap | Show login prompt: "Log in to save items" |
| Logged-in tap | Toggle state. Optimistic update (fill immediately, API call in background) |

### On Product Detail Page

```
[❤️ Save to Wishlist]     ← not saved
[❤️ Saved to Wishlist ✓]  ← saved (tap to remove)
```

---

## Wishlist Page

### URL: `/wishlist`

```
┌────────────────────────────────────────────────────────────────┐
│  My Wishlist (7 items)                                         │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ [img]  Samsung Galaxy A54                                  ││
│  │        AFN 22,000                                          ││
│  │        ✅ In Stock                                         ││
│  │        Seller: Tech Kabul                                  ││
│  │        Added: March 20, 2026                               ││
│  │                                                            ││
│  │        [🛒 Add to Cart]        [🗑 Remove]                  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ [img]  Leather Wallet                                      ││
│  │        ̶A̶F̶N̶ ̶1̶,̶2̶0̶0̶  AFN 900 (25% off!)                     ││
│  │        ✅ In Stock                                         ││
│  │        Seller: Kabul Leather                               ││
│  │        Added: March 18, 2026                               ││
│  │                                                            ││
│  │        [🛒 Add to Cart]        [🗑 Remove]                  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ [img]  Wireless Earbuds                                    ││
│  │        AFN 2,500                                           ││
│  │        ❌ Out of Stock                                     ││
│  │        Seller: Tech Hub                                    ││
│  │        Added: March 15, 2026                               ││
│  │                                                            ││
│  │        [🔔 Notify When Available]  [🗑 Remove]              ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Item States

| State | Display |
|-------|---------|
| In stock | Green "In Stock" + "Add to Cart" button |
| Out of stock | Red "Out of Stock" + "Notify When Available" button (instead of Add to Cart) |
| Price dropped | Show original price struck through + new price + "Price dropped!" badge |
| Product removed | Gray card: "This product is no longer available" + Remove button |

### Notifications from Wishlist

| Trigger | Notification |
|---------|-------------|
| Price drops on wishlist item | "Price drop! {product} is now AFN {price} (was AFN {old})" |
| Wishlist item back in stock | "{product} is back in stock!" |
| Wishlist item about to sell out | "Only 3 left! {product} from your wishlist is almost gone" |

---

## "Save for Later" in Cart

When a buyer clicks "Save for Later" on a cart item:
1. Item is removed from the cart
2. Item is added to the wishlist
3. Item appears in the "Saved for Later" section below the cart items
4. Toast: "Moved to your wishlist"

When a buyer clicks "Move to Cart" on a saved item:
1. Item is removed from the wishlist
2. Item is added to the cart (if in stock)
3. Toast: "Moved to cart"

---

## Backend Requirements

### Model (add to `apps/users/models.py` or separate app)

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | UUID | Primary key | Unique identifier |
| `user` | ForeignKey | FK to User | Whose wishlist |
| `product` | ForeignKey | FK to Product | Which product |
| `created_at` | DateTimeField | Auto-set | When saved |

**Unique constraint:** `(user, product)` -- each product can only be saved once per user.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/me/wishlist/` | GET | List wishlist items |
| `/api/users/me/wishlist/` | POST | Add product `{product_id}` |
| `/api/users/me/wishlist/{product_id}/` | DELETE | Remove from wishlist |
| `/api/users/me/wishlist/check/{product_id}/` | GET | Check if product is in wishlist (for heart icon state) |

---

## Header Wishlist Icon

```
[❤️ 7]   ← heart icon + count of wishlist items
```

Visible only for logged-in users. Tap routes to `/wishlist`.
