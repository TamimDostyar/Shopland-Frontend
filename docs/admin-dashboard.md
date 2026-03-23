# Admin Dashboard

## Purpose

This document covers the admin-facing screens for platform management. Admins verify user identities, approve sellers, approve products, monitor orders, and oversee platform finances. The admin dashboard is a separate section accessible only to users with `role === 'admin'`.

---

## Backend Endpoints Used

### User Management

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users/admin/users/` | GET | List all users |
| `/api/users/admin/users/pending-id-review/` | GET | Users awaiting ID verification |
| `/api/users/admin/users/{id}/verify-id/` | POST | Approve user's identity |
| `/api/users/admin/users/{id}/reject-id/` | POST | Reject user's identity |
| `/api/users/admin/users/{id}/` | PATCH | Suspend/activate user |

### Seller Management

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users/admin/sellers/pending/` | GET | Sellers awaiting approval |
| `/api/users/admin/sellers/{id}/approve/` | POST | Approve seller |
| `/api/users/admin/sellers/{id}/reject/` | POST | Reject seller |

### Product Management

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/catalog/admin/products/pending/` | GET | Products awaiting approval |
| `/api/catalog/admin/products/{id}/approve/` | POST | Approve product |
| `/api/catalog/admin/products/{id}/reject/` | POST | Reject product |
| `/api/catalog/admin/categories/` | POST/PATCH/DELETE | Manage categories |
| `/api/catalog/admin/brands/` | POST/PATCH/DELETE | Manage brands |

### Orders & Finance

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders/admin/orders/` | GET | All orders |
| `/api/orders/admin/orders/{order_number}/status/` | POST | Override order status |
| `/api/payments/admin/collections/` | GET | COD cash collections |
| `/api/payments/admin/settlements/create/` | POST | Create seller settlement |
| `/api/payments/admin/settlements/{id}/complete/` | POST | Complete settlement |
| `/api/payments/admin/revenue/summary/` | GET | Platform revenue |

### Shipping

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/shipping/admin/shipments/` | GET | All shipments |
| `/api/shipping/admin/shipments/{id}/assign/` | POST | Assign driver |
| `/api/shipping/admin/drivers/` | GET | List drivers |

### Reviews

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/reviews/admin/reviews/` | GET | All reviews |
| `/api/reviews/admin/reviews/{id}/deactivate/` | POST | Hide review |
| `/api/reviews/admin/reviews/{id}/activate/` | POST | Restore review |

---

## Screens

### 1. Admin Home / Overview

A dashboard showing actionable counts and key metrics.

| Widget | Content | Priority |
|--------|---------|----------|
| Pending ID Reviews | Number of users waiting for identity verification | High (badge) |
| Pending Seller Approvals | Number of sellers waiting for approval | High (badge) |
| Pending Product Approvals | Number of products waiting for approval | High (badge) |
| Active Orders | Number of orders in progress | Medium |
| Today's Revenue | Platform commission earned today | Medium |
| Total Users | Buyer, seller, driver counts | Low |
| Recent Activity | Feed of latest admin-relevant events | Low |

The widgets with "High" priority should show notification badges to draw attention.

### 2. User Identity Verification

The core admin task -- comparing a user's submitted ID photo against their profile photo and provided information.

**Queue view:**

| Element | Details |
|---------|---------|
| User list | Cards sorted by submission date (oldest first) |
| Each card shows | Name, phone, date submitted, role (buyer/seller) |
| Status filter | Pending, Verified, Rejected |

**Review screen (per user):**

| Section | Content |
|---------|---------|
| Personal info | First name, last name, father's name, date of birth, phone, email |
| National ID number | Displayed prominently |
| Photo comparison | **Side-by-side view:** National ID photo on the left, profile photo on the right |
| Zoom controls | Ability to zoom/enlarge each photo |
| Verification checklist | Name on ID matches submitted name? Photo matches profile photo? ID appears genuine? |
| Action buttons | "Verify Identity" (green), "Reject" (red, requires reason) |

**Reject flow:**
1. Tap "Reject"
2. Required: reason dropdown (blurry photo, name mismatch, suspected fake, other) + optional text
3. Call `POST /api/users/admin/users/{id}/reject-id/` with `{reason}`
4. User is notified and can resubmit

### 3. Seller Approval

Similar to ID verification, but additionally reviews business documentation.

**Review screen (per seller):**

| Section | Content |
|---------|---------|
| Personal verification | Must be ID-verified first (show status) |
| Shop info | Shop name, category, description |
| Business license | License number + photo (zoomable) |
| Shop address | Full address |
| Business phone | Phone number |
| Action buttons | "Approve Seller" (green), "Reject" (red, requires reason) |

An admin should not approve a seller whose personal identity hasn't been verified yet. The UI should block the approve button and show a message if `is_id_verified === false`.

### 4. Product Approval

Review products before they go live.

**Queue view:**

| Element | Details |
|---------|---------|
| Product list | Cards with primary image, name, seller, category, price, date submitted |
| Sort | Oldest first (FIFO) |

**Review screen (per product):**

| Section | Content |
|---------|---------|
| Product images | Gallery view, all uploaded images |
| Product info | Name (all languages), description, category, brand, condition, price |
| Seller info | Shop name, seller approval status, seller rating |
| Checklist | Appropriate images? Accurate description? Reasonable price? Correct category? |
| Action buttons | "Approve" (green), "Reject" (red, requires reason) |

### 5. User Management

A searchable, filterable list of all users.

| Element | Details |
|---------|---------|
| Search | By name, email, phone, national ID |
| Filters | Role (buyer/seller/admin/driver), verification status, active/suspended |
| User table | Name, email, role, verified (badges), status, joined date |
| User detail | Tap to view full profile + history |
| Actions | Suspend user, activate user |

### 6. Order Management

Overview of all orders on the platform.

| Element | Details |
|---------|---------|
| Search | By order number |
| Filters | Status, date range, city/province |
| Order table | Order number, buyer, seller(s), total, status, date |
| Order detail | Full order info + status history + ability to force status change |

**Force status change:** Admin can override any order status (e.g., mark as delivered if driver forgot to update). Requires a reason/note.

### 7. Category & Brand Management

CRUD interface for categories and brands.

**Categories:**

| Element | Details |
|---------|---------|
| Tree view | Nested category hierarchy, drag-to-reorder |
| Add category | Name (3 languages), parent, image, display order |
| Edit/Delete | Inline actions (delete only if no products use it, or reassign) |

**Brands:**

| Element | Details |
|---------|---------|
| List view | Brand name, logo, product count |
| Add/Edit | Name, logo upload |
| Delete | Only if no products reference it |

### 8. Finance / Revenue

| Section | Content |
|---------|---------|
| Revenue summary | Total commission earned (today, this week, this month, all time) |
| COD collections | List of cash collected by drivers, status (collected/delivered to platform/verified) |
| Seller settlements | Create new settlements, view pending/completed |
| Settlement creation | Select seller, date range, auto-calculate amount from pending earnings |

### 9. Shipping / Driver Management

| Element | Details |
|---------|---------|
| Driver list | Name, zone, vehicle, availability, total deliveries, rating |
| Unassigned shipments | Orders ready for pickup with no driver assigned |
| Assign driver | Select from available drivers in the correct zone |

### 10. Review Moderation

| Element | Details |
|---------|---------|
| Reported/flagged reviews | Reviews reported by users (future feature) |
| All reviews | Searchable list, sortable by date |
| Actions | Deactivate (hide) or activate (restore) |
| Review detail | Full review text, seller response, product link |

---

## Admin Navigation

The admin dashboard uses a sidebar navigation (web/desktop) or tab bar (mobile).

```
Admin Dashboard
├── Overview (home)
├── Verifications
│   ├── ID Reviews
│   └── Seller Approvals
├── Products
│   ├── Pending Approval
│   └── Categories & Brands
├── Users
├── Orders
├── Finance
│   ├── Revenue
│   ├── Collections
│   └── Settlements
├── Shipping
│   ├── Shipments
│   └── Drivers
└── Reviews
```

---

## Platform Notes

The admin dashboard is primarily a **web and desktop** experience. Mobile admin access can be a simplified read-only overview with approval actions, but full management (category editing, settlement creation) is best done on a larger screen.

| Feature | Web | Desktop | Mobile |
|---------|-----|---------|--------|
| Full dashboard | Yes | Yes | Simplified |
| Photo comparison (ID review) | Side-by-side with zoom | Side-by-side with zoom | Swipeable cards |
| Category tree management | Drag-and-drop tree | Drag-and-drop tree | Basic list only |
| Settlement creation | Full form | Full form | Not available |
| Data tables | Full tables with sorting | Full tables with sorting | Card-based lists |

---

## Routes

```typescript
export const ADMIN_ROUTES = {
  DASHBOARD: "/admin",
  ID_REVIEWS: "/admin/verifications/id-reviews",
  SELLER_APPROVALS: "/admin/verifications/seller-approvals",
  PRODUCT_APPROVALS: "/admin/products/pending",
  CATEGORIES: "/admin/products/categories",
  BRANDS: "/admin/products/brands",
  USERS: "/admin/users",
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  ORDERS: "/admin/orders",
  ORDER_DETAIL: (orderNumber: string) => `/admin/orders/${orderNumber}`,
  REVENUE: "/admin/finance/revenue",
  COLLECTIONS: "/admin/finance/collections",
  SETTLEMENTS: "/admin/finance/settlements",
  SHIPMENTS: "/admin/shipping/shipments",
  DRIVERS: "/admin/shipping/drivers",
  REVIEWS: "/admin/reviews",
} as const;
```
