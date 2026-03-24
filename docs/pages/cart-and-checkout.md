# Cart & Checkout Pages

## Access

- Cart: accessible to everyone (guests have session cart, logged-in users have server cart)
- Checkout: requires login + full verification (phone + email + ID)

---

## Mini-Cart Drawer

Appears when tapping the cart icon from any page (does NOT navigate away from current page).

```
                          ┌──────────────────────┐
                          │  Your Cart (3 items)  │
                          │                       │
                          │  [img] Samsung A54    │
                          │        AFN 22,000 x1  │
                          │                       │
                          │  [img] Nike Shoes     │
                          │        AFN 3,500 x2   │
                          │                       │
                          │  [img] Phone Case     │
                          │        AFN 350 x1     │
                          │                       │
                          │  ──────────────────── │
                          │  Total: AFN 29,350    │
                          │                       │
                          │  [View Cart]           │
                          │  [Checkout →]          │
                          └──────────────────────┘
```

| Element | Details |
|---------|---------|
| Trigger | Tap/hover on cart icon in header |
| Display | Slide-in drawer from the right (web/desktop). Bottom sheet (mobile) |
| Items | Max 3-4 shown, "and X more items" link if more |
| Close | Tap outside or X button |
| "View Cart" | Routes to full cart page |
| "Checkout" | Routes to checkout (or login if guest) |

---

## Full Cart Page

### URL: `/cart`

### Empty Cart

```
┌────────────────────────────────────────────────┐
│                                                │
│              🛒                                 │
│                                                │
│          Your cart is empty                    │
│                                                │
│   Looks like you haven't added anything yet.   │
│                                                │
│         [Start Shopping →]                      │
│                                                │
│   ── You might like ──────────────────────     │
│   [Product] [Product] [Product] [Product]      │
│                                                │
└────────────────────────────────────────────────┘
```

"You might like" shows popular products or recently viewed.

### Cart With Items

```
┌────────────────────────────────────────────────────────────────┐
│  Shopping Cart (3 items)                     [Clear Cart]      │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ [img]  Samsung Galaxy A54                                  ││
│  │        Seller: Tech Kabul                                  ││
│  │        AFN 22,000                                          ││
│  │        Qty: [- 1 +]              Subtotal: AFN 22,000     ││
│  │        [Save for Later]  [Remove]                          ││
│  │        ✅ In Stock                                         ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │ [img]  Nike Running Shoes                                  ││
│  │        Seller: Shoe Palace                                 ││
│  │        AFN 3,500                                           ││
│  │        Qty: [- 2 +]              Subtotal: AFN 7,000      ││
│  │        [Save for Later]  [Remove]                          ││
│  │        ⚠️ Only 3 left in stock                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Saved for Later (1 item)                                  ││
│  │  ┌───────────────────────────────────────────────────────┐ ││
│  │  │ [img] Phone Case - AFN 350    [Move to Cart] [Remove]│ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌──────────────────────────┐                                  │
│  │  Order Summary           │                                  │
│  │                          │                                  │
│  │  Items (3):  AFN 29,350  │                                  │
│  │  Delivery:   AFN 200     │                                  │
│  │  ─────────────────────── │                                  │
│  │  Total:      AFN 29,550  │                                  │
│  │                          │                                  │
│  │  💵 Cash on Delivery     │                                  │
│  │                          │                                  │
│  │  [Proceed to Checkout →] │                                  │
│  └──────────────────────────┘                                  │
│                                                                │
│  ── You might also like ──────────────────────────────────     │
│  [Product] [Product] [Product] [Product]                       │
└────────────────────────────────────────────────────────────────┘
```

### Cart Item Actions

| Action | Behavior |
|--------|----------|
| Quantity +/- | Optimistic update. API call to PATCH. Revert on error |
| "Remove" | Confirm dialog: "Remove from cart?" Yes removes. Undo toast for 5 seconds |
| "Save for Later" | Moves item from cart to wishlist. Shows in "Saved for Later" section below cart |
| "Move to Cart" | Moves item from Saved for Later back into the cart |
| Product name tap | Routes to product detail page |

### Cart Warnings

| Warning | When | Display |
|---------|------|---------|
| Out of stock | Product became unavailable | Red banner on the item + "Remove" CTA |
| Price changed | Product price changed since added | Yellow banner: "Price updated from AFN X to AFN Y" |
| Low stock | Available qty < cart qty | Orange: "Only X available. We adjusted your quantity." |

---

## Checkout Page

### URL: `/checkout`

**Access gate:** If not fully verified, show a blocker instead of the checkout form.

```
┌────────────────────────────────────────────────┐
│  ⚠️ Complete Your Verification                 │
│                                                │
│  You need to verify your identity before       │
│  placing an order.                             │
│                                                │
│  □ Phone verified   ✅                         │
│  □ Email verified   ✅                         │
│  □ ID verified      ⏳ Under review            │
│                                                │
│  We'll notify you when your ID is verified.    │
│  This usually takes 24-48 hours.               │
└────────────────────────────────────────────────┘
```

### Checkout Form (fully verified buyer)

```
┌────────────────────────────────────────────────────────────────┐
│  Checkout                                                      │
│                                                                │
│  ── 1. Delivery Address ──────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 📍 Home (Default)                                [Change]  ││
│  │    Tamim Dostyar                                            ││
│  │    District 5, Kabul, Kabul Province                        ││
│  │    Near the blue mosque                                     ││
│  │    +93 70 123 4567                                          ││
│  └────────────────────────────────────────────────────────────┘│
│                         [+ Add New Address]                    │
│                                                                │
│  ── 2. Order Items ───────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ From: Tech Kabul                                           ││
│  │ [img] Samsung Galaxy A54    x1    AFN 22,000               ││
│  │ 🚚 Delivery: March 25-27   Fee: AFN 150                    ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │ From: Shoe Palace                                          ││
│  │ [img] Nike Running Shoes    x2    AFN 7,000                ││
│  │ 🚚 Delivery: March 26-28   Fee: AFN 150                    ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── 3. Payment ───────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 💵 Cash on Delivery                                        ││
│  │    Pay in cash when your order arrives                      ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── 4. Special Instructions (optional) ───────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Any notes for the seller or delivery driver?              ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Order Summary ────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Items (3):          AFN 29,000                            ││
│  │  Delivery (2 shops): AFN 300                               ││
│  │  ─────────────────────────────                             ││
│  │  Total:              AFN 29,300                            ││
│  │                                                            ││
│  │  You will pay AFN 29,300 in cash on delivery               ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  By placing this order, you agree to our Terms of Service      │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │              Place Order (AFN 29,300)                       ││
│  └────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

### Multi-Seller Orders

If the cart has items from multiple sellers, they are grouped by seller at checkout. Each seller group shows:
- Seller name
- Items from that seller
- Delivery estimate for that group
- Delivery fee for that group

This helps the buyer understand they may receive multiple deliveries.

### Order Confirmation

### URL: `/order-confirmed/{orderNumber}`

```
┌────────────────────────────────────────────────┐
│                                                │
│              ✅                                 │
│                                                │
│       Order Placed Successfully!               │
│                                                │
│    Order Number: SL-20260323-0042              │
│                                                │
│    Total: AFN 29,300 (Cash on Delivery)        │
│                                                │
│    The seller will review your order           │
│    shortly. We'll notify you when it's         │
│    accepted.                                   │
│                                                │
│    Estimated delivery: March 25-28             │
│                                                │
│    [Track Order →]                             │
│    [Continue Shopping]                         │
│                                                │
└────────────────────────────────────────────────┘
```
