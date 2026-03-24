# Order Tracking & History Pages

## Access

Requires login. Buyers see their orders. Sellers see incoming orders.

---

## My Orders Page (Buyer)

### URL: `/orders`

```
┌────────────────────────────────────────────────────────────────┐
│  My Orders                                                     │
│                                                                │
│  [Active]  [Completed]  [Cancelled]                            │
│  ─────────                                                     │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Order #SL-20260323-0042                    March 23, 2026 ││
│  │  ┌────────────────────────────────────────────────────────┐││
│  │  │ [img] [img] [img]   3 items    Total: AFN 29,300      │││
│  │  └────────────────────────────────────────────────────────┘││
│  │  Status: [🟡 Being Prepared]                               ││
│  │  Estimated delivery: March 25-27                           ││
│  │                                           [View Details →] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Order #SL-20260322-0038                    March 22, 2026 ││
│  │  ┌────────────────────────────────────────────────────────┐││
│  │  │ [img]                1 item     Total: AFN 5,200       │││
│  │  └────────────────────────────────────────────────────────┘││
│  │  Status: [🔵 Out for Delivery]                             ││
│  │  Driver is on the way                                      ││
│  │                                           [Track Order →]  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  No more orders                                                │
└────────────────────────────────────────────────────────────────┘
```

### Status Badge Colors

| Status | Color | Label |
|--------|-------|-------|
| pending | Gray | Waiting for Seller |
| accepted | Blue | Accepted |
| processing | Yellow | Being Prepared |
| ready_for_pickup | Orange | Ready for Pickup |
| out_for_delivery | Blue (pulsing) | Out for Delivery |
| delivered | Green | Delivered |
| completed | Green (check) | Completed |
| cancelled_* | Red | Cancelled |
| rejected | Red | Rejected by Seller |

---

## Order Detail Page (Buyer)

### URL: `/orders/{orderNumber}`

```
┌────────────────────────────────────────────────────────────────┐
│  ← My Orders                                                  │
│                                                                │
│  Order #SL-20260323-0042                                       │
│  Placed on March 23, 2026 at 10:30 AM                         │
│                                                                │
│  ── Status Timeline ──────────────────────────────────────     │
│                                                                │
│   ✅ Order Placed ─── ✅ Accepted ─── 🟡 Preparing ─── ○ ─── ○│
│   Mar 23, 10:30      Mar 23, 11:15   Mar 23, 2:00             │
│                                                                │
│  Current: Your order is being prepared by the seller           │
│                                                                │
│  ── Delivery ─────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  🚚 Estimated: March 25-27                                 ││
│  │  📍 To: District 5, Kabul                                  ││
│  │  📞 Delivery phone: +93 70 123 4567                        ││
│  │                                                            ││
│  │  Driver not yet assigned                                   ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── When driver is assigned ──────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  🚚 Driver: Mohammad R.                                    ││
│  │  🏍️ Motorcycle                                              ││
│  │  📞 +93 70 987 6543                [📞 Call]  [💬 Message]  ││
│  │  Status: Heading to the seller for pickup                  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Items ────────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  From: Tech Kabul                                          ││
│  │  [img]  Samsung Galaxy A54        x1     AFN 22,000        ││
│  │  [img]  Phone Case               x1     AFN 350            ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │  From: Shoe Palace                                         ││
│  │  [img]  Nike Running Shoes        x2     AFN 7,000         ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Payment ──────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Items (4):           AFN 29,350                           ││
│  │  Delivery:            AFN 300                              ││
│  │  ─────────────────────────────                             ││
│  │  Total:               AFN 29,650                           ││
│  │  💵 Cash on Delivery                                       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── Notes ────────────────────────────────────────────────     │
│  "Please call before delivery"                                 │
│                                                                │
│  ── Actions ──────────────────────────────────────────────     │
│  [Cancel Order]  (shown only if pending/accepted/processing)   │
│  [Confirm Received] (shown only if status = delivered)         │
│  [Rate & Review]    (shown only if status = completed)         │
│  [💬 Message Seller]                                           │
│  [Need Help? →]                                                │
└────────────────────────────────────────────────────────────────┘
```

### Status Timeline Component

Visual progress bar showing all stages. Completed stages have checkmarks and timestamps. Current stage is highlighted/pulsing. Future stages are grayed out.

```
Horizontal (web/desktop):
  ✅ ──── ✅ ──── 🟡 ──── ○ ──── ○ ──── ○

Vertical (mobile):
  ✅  Order Placed         Mar 23, 10:30 AM
  │
  ✅  Accepted by Seller   Mar 23, 11:15 AM
  │
  🟡  Being Prepared       Mar 23, 2:00 PM
  │
  ○   Ready for Pickup
  │
  ○   Out for Delivery
  │
  ○   Delivered
```

### After Delivery - Confirm & Review Prompt

```
┌────────────────────────────────────────────────────────────────┐
│  🎉 Your order has been delivered!                             │
│                                                                │
│  Did you receive everything and pay the driver?                │
│                                                                │
│  [✅ Yes, I received my order]                                 │
│  [❌ Report a problem]                                         │
│                                                                │
│  ── After confirming ─────────────────────────────────────     │
│                                                                │
│  ⭐ How was your order?                                        │
│                                                                │
│  Tech Kabul - Samsung Galaxy A54                               │
│  [★] [★] [★] [★] [★]   Tap to rate                           │
│                                                                │
│  [Write a Review →]     [Maybe Later]                          │
└────────────────────────────────────────────────────────────────┘
```

---

## Cancelled Order View

```
┌────────────────────────────────────────────────┐
│  Order #SL-20260323-0042                       │
│                                                │
│  ❌ Order Cancelled                            │
│                                                │
│  Cancelled by: Seller                          │
│  Reason: "Item is out of stock, sorry!"        │
│  Date: March 23, 2026 at 3:00 PM              │
│                                                │
│  No payment was collected.                     │
│                                                │
│  [Browse Similar Products →]                   │
│  [Contact Support]                             │
└────────────────────────────────────────────────┘
```

---

## Real-Time Updates

| Situation | Behavior |
|-----------|----------|
| Order is out for delivery | Poll `/api/shipping/track/{order_number}/` every 30 seconds |
| Any status change | Push notification (mobile), browser notification (web), or in-app notification |
| Order detail page open | Refetch on focus/visibility change |
| Auto-complete | If buyer doesn't confirm delivery within 48 hours, order auto-completes |
