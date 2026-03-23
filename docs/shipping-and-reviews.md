# Shipping & Reviews

## Purpose

This document covers two user-facing features: delivery tracking (buyers watching their package) and the review system (buyers rating products after delivery). These are grouped together because reviews are unlocked only after a successful delivery.

---

## Part 1: Shipping & Delivery Tracking

### Backend Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/shipping/track/{order_number}/` | GET | Shipment tracking info for buyer |

Delivery tracking is displayed within the order detail screen (see [orders.md](./orders.md)), not as a standalone page.

### Tracking UI (within Order Detail)

When an order status is `ready_for_pickup`, `out_for_delivery`, or `delivered`, the order detail screen shows a delivery tracking section.

**Before driver assignment:**

| Element | Details |
|---------|---------|
| Status | "Waiting for a delivery driver to be assigned" |
| Animation | Loading/waiting animation |

**After driver assignment:**

| Element | Details |
|---------|---------|
| Driver card | Driver name, profile photo, vehicle type icon |
| Driver phone | Tap to call (mobile) or click to copy (web/desktop) |
| Status | Current shipment status in human-readable text |
| Timeline | Visual progress: Assigned -> Picking up -> Picked up -> In transit -> Arrived -> Delivered |
| Estimated delivery | Time estimate if available |

**Status text mapping:**

| API Status | Display Text |
|------------|-------------|
| `awaiting_driver` | "Waiting for a driver" |
| `driver_assigned` | "A driver has been assigned to your order" |
| `picking_up` | "Driver is heading to the seller to pick up your order" |
| `picked_up` | "Driver has your order and is preparing to deliver" |
| `in_transit` | "Your order is on its way to you!" |
| `arrived` | "Driver has arrived at your location" |
| `delivered` | "Your order has been delivered" |
| `failed` | "Delivery could not be completed. Contact support." |

**Auto-refresh:** Poll the tracking endpoint every 30 seconds when the order is `out_for_delivery`. Stop polling when status changes to `delivered` or `failed`.

### Delivery Fee Display

Show the delivery fee breakdown at checkout and in the order detail:

| Route Type | Display |
|-----------|---------|
| Same city | "Standard delivery - AFN 150" |
| Same province | "Provincial delivery - AFN 400" |
| Different province | "Long-distance delivery - AFN 800" |

---

## Part 2: Reviews

### Backend Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/reviews/products/{product_id}/reviews/` | GET | List reviews for a product |
| `/api/reviews/products/{product_id}/reviews/summary/` | GET | Rating summary |
| `/api/reviews/products/{product_id}/reviews/` | POST | Write a review |
| `/api/reviews/reviews/{id}/` | PATCH | Edit own review |
| `/api/reviews/reviews/{id}/` | DELETE | Delete own review |
| `/api/reviews/my-reviews/` | GET | List buyer's own reviews |
| `/api/reviews/seller/reviews/` | GET | Reviews on seller's products |
| `/api/reviews/reviews/{id}/respond/` | POST | Seller responds to a review |

### Review Components

#### Rating Stars Component

Reusable star display used everywhere ratings appear.

| Mode | Behavior |
|------|----------|
| Display mode | Shows filled/unfilled stars + numeric rating + review count |
| Input mode | Tappable stars for rating selection (1-5) |

**Display examples:**
- ★★★★☆ 4.2 (128 reviews)
- ★★★☆☆ 3.0 (5 reviews)
- No reviews yet

#### Rating Summary Component

Shown at the top of the reviews section on a product detail page.

| Element | Details |
|---------|---------|
| Average rating | Large number + stars |
| Total reviews | "Based on 128 reviews" |
| Rating breakdown | Bar chart showing count per star level |

```
5 ★ ████████████████  85
4 ★ ████████          42
3 ★ ███               15
2 ★ █                  5
1 ★ █                  3
```

#### Review Card Component

A single review displayed in a list.

| Element | Details |
|---------|---------|
| Buyer name | First name + last initial (e.g. "Ahmad K.") |
| Rating | Star display |
| Date | "March 20, 2026" |
| Title | Review headline (if provided) |
| Body | Review text (truncated with "Read more" if long) |
| Seller response | Indented below the review, labeled "Seller response" |

### Screens

#### Reviews on Product Detail Page

Embedded in the product detail page (see [catalog.md](./catalog.md)).

| Element | Details |
|---------|---------|
| Rating summary | Average + breakdown (see above) |
| Recent reviews | 3-5 most recent reviews |
| "See All Reviews" link | Routes to full reviews page |

#### Full Reviews Page

Accessed from "See All Reviews" on the product detail.

| Element | Details |
|---------|---------|
| Rating summary | Same component as product page |
| Sort | Most recent (default), highest rated, lowest rated |
| Review list | Paginated list of all reviews |
| "Write a Review" button | Only shown if buyer has purchased this product and hasn't reviewed yet |

#### Write Review Screen / Modal

Triggered from:
- Order detail page (after marking as completed)
- Product detail page (if buyer has a completed order for this product)

| Field | Type | Validation |
|-------|------|------------|
| Rating | Star input (1-5) | Required |
| Title | Text input | Optional, max 100 chars |
| Review text | Textarea | Optional, max 2000 chars |
| Submit button | Primary CTA | Disabled until rating is selected |

**Submit flow:**
1. Call `POST /api/reviews/products/{product_id}/reviews/` with `{rating, title, body, order_id}`
2. On success: show confirmation, invalidate product query (to update average rating)
3. On error: show validation errors

#### My Reviews (Buyer)

Accessible from profile.

| Element | Details |
|---------|---------|
| Review list | All reviews the buyer has written |
| Each card | Product name + image, rating, date, review text |
| Actions | Edit, Delete (with confirmation) |

#### Seller Review Management

Part of the seller dashboard.

| Element | Details |
|---------|---------|
| Review list | All reviews on the seller's products |
| Filter | By product, by rating, responded/not responded |
| Each card | Product, buyer name, rating, review text, seller response (if any) |
| "Respond" button | Opens response form (only if not yet responded) |

**Respond form:**

| Field | Type | Validation |
|-------|------|------------|
| Response text | Textarea | Required, max 1000 chars |

One response per review. After responding, the button changes to "Edit Response" (or responses are not editable -- business decision).

---

## Review Prompt Strategy

Prompt buyers to leave reviews at the right moments:

| Trigger | Action |
|---------|--------|
| Order completed | Show "Rate your purchase" prompt in the order detail |
| 48 hours after delivery | Push notification: "How was your order from {shop_name}?" |
| On product detail page | If buyer purchased but hasn't reviewed: "You purchased this. Leave a review?" |

---

## Types

```typescript
export interface Review {
  id: string;
  product: { id: string; slug: string; name: string; primaryImage: string };
  buyer: { firstName: string; lastInitial: string };
  rating: number;
  title?: string;
  body?: string;
  sellerResponse?: SellerResponse;
  createdAt: string;
  updatedAt: string;
}

export interface SellerResponse {
  id: string;
  body: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewPayload {
  rating: number;
  title?: string;
  body?: string;
  orderId: string;
}
```

---

## Routes

```typescript
export const REVIEW_ROUTES = {
  PRODUCT_REVIEWS: (productId: string) => `/product/${productId}/reviews`,
  MY_REVIEWS: "/profile/reviews",
  WRITE_REVIEW: (productId: string) => `/product/${productId}/review/new`,
  SELLER_REVIEWS: "/seller/reviews",
} as const;
```
