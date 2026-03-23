# Orders

## Purpose

This document covers how buyers track their orders and how sellers manage incoming orders. The order screen is the post-purchase experience -- from "order placed" to "delivered and paid."

---

## Backend Endpoints Used

### Buyer

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders/my-orders/` | GET | List buyer's orders |
| `/api/orders/my-orders/{order_number}/` | GET | Order detail with status history |
| `/api/orders/my-orders/{order_number}/cancel/` | POST | Cancel an order |
| `/api/orders/my-orders/{order_number}/confirm/` | POST | Confirm delivery received |
| `/api/shipping/track/{order_number}/` | GET | Shipment tracking info |

### Seller

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders/seller/orders/` | GET | List orders for seller's products |
| `/api/orders/seller/orders/{order_number}/` | GET | Order detail |
| `/api/orders/seller/orders/{order_number}/accept/` | POST | Accept an order |
| `/api/orders/seller/orders/{order_number}/reject/` | POST | Reject with reason |
| `/api/orders/seller/orders/{order_number}/processing/` | POST | Mark as preparing |
| `/api/orders/seller/orders/{order_number}/ready/` | POST | Mark as ready for pickup |

---

## Buyer Screens

### 1. My Orders List

Accessible from the main navigation or profile.

**Tabs/Filters:**

| Tab | Shows |
|-----|-------|
| Active | Orders with status: pending, accepted, processing, ready_for_pickup, out_for_delivery |
| Completed | Orders with status: delivered, completed |
| Cancelled | Orders with status: cancelled_by_buyer, cancelled_by_seller, cancelled_by_admin |

**Order Card (in the list):**

| Element | Details |
|---------|---------|
| Order number | `SL-20260323-0042` |
| Date | "March 23, 2026" |
| Status badge | Color-coded: yellow (pending), blue (processing), green (delivered), red (cancelled) |
| Items preview | First item image + "and X more items" |
| Total | "AFN 5,200" |
| Tap action | Routes to order detail |

### 2. Order Detail (Buyer View)

Full view of a single order.

**Layout:**

| Section | Content |
|---------|---------|
| Order header | Order number, date placed, current status badge |
| Status timeline | Visual step indicator showing the order's journey (see below) |
| Delivery tracking | Driver info + live status (when out for delivery) |
| Items list | Each item: image, name, quantity, price, seller name |
| Price breakdown | Subtotal, delivery fee, total |
| Delivery address | Full address + phone |
| Buyer notes | If any were provided |
| Actions | Cancel button (if cancellable), Confirm delivery button (if delivered) |

**Status Timeline Component:**

A vertical or horizontal progress indicator showing all stages:

```
✓ Order Placed (Mar 23, 10:30 AM)
✓ Accepted by Seller (Mar 23, 11:15 AM)
✓ Being Prepared (Mar 23, 2:00 PM)
● Ready for Pickup (Mar 23, 4:30 PM)    ← current
○ Out for Delivery
○ Delivered
```

Completed steps show checkmarks + timestamps. Current step is highlighted. Future steps are grayed out.

**Cancel order flow:**
1. "Cancel Order" button visible only when status is `pending`, `accepted`, or `processing`
2. Tap -> confirmation dialog: "Are you sure? This cannot be undone."
3. Optional: reason textarea
4. Call `POST /api/orders/my-orders/{order_number}/cancel/`
5. On success: update status to `cancelled_by_buyer`, show confirmation

**Confirm delivery flow:**
1. "Confirm Received" button visible when status is `delivered`
2. Tap -> confirmation: "Did you receive your order and pay the driver?"
3. Call `POST /api/orders/my-orders/{order_number}/confirm/`
4. On success: status changes to `completed`, show option to leave a review

### 3. Delivery Tracking (within Order Detail)

When the order is `out_for_delivery`, show tracking information.

| Element | Details |
|---------|---------|
| Driver info | Name, phone (tap to call), vehicle type |
| Status | "Driver is on the way to you" |
| Estimated arrival | Time estimate if available |
| Call driver button | Opens phone dialer |

---

## Seller Screens

### 1. Seller Orders List

Part of the seller dashboard. Shows orders that contain the seller's products.

**Tabs:**

| Tab | Shows |
|-----|-------|
| New | Pending orders (needs accept/reject) -- with notification badge count |
| Active | Accepted, processing, ready_for_pickup |
| Completed | Delivered, completed |
| Cancelled | All cancelled statuses |

**Order Card (seller view):**

| Element | Details |
|---------|---------|
| Order number | `SL-20260323-0042` |
| Date | When ordered |
| Buyer name | First name only (privacy) |
| Items | Only the items belonging to this seller |
| Subtotal | Total for this seller's items only |
| Status | Current status with color badge |
| Action buttons | Accept/Reject (if pending), Mark Processing, Mark Ready |

### 2. Order Detail (Seller View)

| Section | Content |
|---------|---------|
| Order header | Order number, date, status |
| Buyer info | First name, delivery city/province (not full address until accepted) |
| Items | This seller's items: image, name, quantity, price |
| Delivery address | Full address (shown only after order is accepted) |
| Action buttons | Based on current status (see below) |

**Seller action buttons by status:**

| Current Status | Available Actions |
|----------------|-------------------|
| `pending` | "Accept Order" (green), "Reject Order" (red) |
| `accepted` | "Mark as Preparing" |
| `processing` | "Mark as Ready for Pickup" |
| `ready_for_pickup` | No action (waiting for driver) |
| `out_for_delivery` | No action (in transit) |
| `delivered` / `completed` | None -- order is done |

**Reject order flow:**
1. Tap "Reject Order"
2. Required: reason textarea (e.g. "Item out of stock", "Cannot fulfill")
3. Call `POST /api/orders/seller/orders/{order_number}/reject/`
4. Buyer is notified of rejection + reason

---

## Notifications

Orders are time-sensitive. The frontend should support notifications:

| Event | Who gets notified | Message |
|-------|-------------------|---------|
| New order placed | Seller | "New order #{number} received" |
| Order accepted | Buyer | "Your order #{number} has been accepted by the seller" |
| Order rejected | Buyer | "Your order #{number} was rejected. Reason: ..." |
| Ready for pickup | Buyer | "Your order is packed and waiting for the driver" |
| Out for delivery | Buyer | "Your order is on its way!" |
| Delivered | Buyer | "Your order has been delivered. Please confirm." |
| Order cancelled | Seller/Buyer | "Order #{number} has been cancelled" |

**Implementation:**
- Web: browser push notifications (with permission) or in-app notification bell
- Mobile: native push notifications via Expo
- Desktop: system notifications via Electron
- Fallback: in-app notification center accessible from the header

---

## Order Types

```typescript
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: Address;
  deliveryPhone: string;
  buyerNotes?: string;
  cancellationReason?: string;
  cancelledBy?: 'buyer' | 'seller' | 'admin';
  statusHistory: OrderStatusEntry[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'processing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled_by_buyer'
  | 'cancelled_by_seller'
  | 'cancelled_by_admin';

export interface OrderItem {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  seller: SellerSummary;
  product?: { id: string; slug: string; primaryImage: string };
}

export interface OrderStatusEntry {
  oldStatus: string;
  newStatus: string;
  note?: string;
  createdAt: string;
}
```

---

## Routes

```typescript
export const ORDER_ROUTES = {
  MY_ORDERS: "/orders",
  ORDER_DETAIL: (orderNumber: string) => `/orders/${orderNumber}`,
  SELLER_ORDERS: "/seller/orders",
  SELLER_ORDER_DETAIL: (orderNumber: string) => `/seller/orders/${orderNumber}`,
} as const;
```
