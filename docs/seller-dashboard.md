# Seller Dashboard

## Purpose

This document covers all seller-facing screens: product management, inventory, incoming orders, earnings, and settlements. The seller dashboard is a separate section of the app that only approved sellers can access.

---

## Backend Endpoints Used

### Products

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/catalog/seller/products/` | GET | List seller's products |
| `/api/catalog/seller/products/` | POST | Create product |
| `/api/catalog/seller/products/{id}/` | PATCH | Update product |
| `/api/catalog/seller/products/{id}/` | DELETE | Delete product |
| `/api/catalog/seller/products/{id}/images/` | POST | Upload images |
| `/api/catalog/seller/products/{id}/images/{img_id}/` | DELETE | Remove image |

### Inventory

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/inventory/seller/stock/` | GET | All stock levels |
| `/api/inventory/seller/stock/{product_id}/restock/` | POST | Add stock |
| `/api/inventory/seller/stock/{product_id}/adjust/` | POST | Set stock |
| `/api/inventory/seller/stock/low/` | GET | Low-stock products |

### Orders

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders/seller/orders/` | GET | All incoming orders |
| `/api/orders/seller/orders/{order_number}/accept/` | POST | Accept |
| `/api/orders/seller/orders/{order_number}/reject/` | POST | Reject |
| `/api/orders/seller/orders/{order_number}/processing/` | POST | Mark preparing |
| `/api/orders/seller/orders/{order_number}/ready/` | POST | Mark ready |

### Earnings

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/payments/seller/earnings/` | GET | Earnings list |
| `/api/payments/seller/earnings/summary/` | GET | Earnings summary |
| `/api/payments/seller/settlements/` | GET | Settlement history |

---

## Access Control

The seller dashboard is only accessible to users where:
- `role === 'seller'`
- `verificationStatus.sellerApproved === true`

If the user is a seller but not yet approved, show the "Pending Approval" screen (see [auth.md](./auth.md)) instead of the dashboard.

---

## Screens

### 1. Seller Home / Overview

The landing page of the seller dashboard. A quick snapshot of the seller's business.

| Widget | Content | Data Source |
|--------|---------|-------------|
| New Orders | Count of pending orders, "View" link | `GET /api/orders/seller/orders/?status=pending` |
| Active Orders | Count of accepted/processing/ready orders | `GET /api/orders/seller/orders/?status=accepted,processing,ready_for_pickup` |
| Low Stock Alerts | Count of products below threshold, "View" link | `GET /api/inventory/seller/stock/low/` |
| Pending Approval | Count of products awaiting admin approval | `GET /api/catalog/seller/products/?is_approved=false` |
| Earnings This Month | Total net earnings for current month | `GET /api/payments/seller/earnings/summary/` |
| Pending Settlement | Amount earned but not yet settled | Same endpoint |

### 2. Product Management

#### Product List

| Element | Details |
|---------|---------|
| Product cards/table | Image, name, price, stock, status (active/inactive/pending/rejected), actions |
| Filter bar | Status: All, Active, Pending Approval, Rejected, Inactive |
| "Add Product" button | Routes to product creation form |
| Inline actions | Edit, Deactivate/Activate, Delete (with confirmation) |

**Product status indicators:**

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| Active + Approved | Green | Visible to buyers |
| Pending Approval | Yellow | Submitted, waiting for admin |
| Rejected | Red | Admin rejected (show reason) |
| Inactive | Gray | Seller deactivated |
| Out of Stock | Orange | Stock = 0 |

#### Add/Edit Product Form

Multi-step or single-page form.

**Product Details:**

| Field | Type | Validation |
|-------|------|------------|
| Product Name | Text | Required, 3-200 chars |
| Product Name (Dari) | Text | Optional |
| Product Name (Pashto) | Text | Optional |
| Description | Rich textarea | Required |
| Description (Dari) | Rich textarea | Optional |
| Description (Pashto) | Rich textarea | Optional |
| Category | Nested dropdown (parent > child) | Required |
| Brand | Dropdown with search | Optional |
| Condition | Radio: New, Used, Refurbished | Required, default New |
| Price (AFN) | Number input | Required, min 1 |
| Discount Price (AFN) | Number input | Optional, must be less than price |

**Images:**

| Element | Details |
|---------|---------|
| Image upload area | Drag-and-drop (web/desktop) or tap-to-select (mobile) |
| Max images | 10 per product |
| Primary image toggle | Select which image is the primary/thumbnail |
| Reorder | Drag to reorder display order |
| Delete | X button on each image |

**Stock:**

| Field | Type | Validation |
|-------|------|------------|
| Initial Stock | Number input | Required, min 0 |
| Low Stock Threshold | Number input | Default 5 |

**Submit flow:**
1. Validate all fields client-side
2. Call `POST /api/catalog/seller/products/` with product data
3. Upload images via `POST /api/catalog/seller/products/{id}/images/`
4. Set stock via `POST /api/inventory/seller/stock/{product_id}/restock/`
5. Show success: "Product submitted for review. It will be visible after admin approval."

### 3. Inventory Management

| Element | Details |
|---------|---------|
| Product list | Table: product name, current stock, reserved, available, low-stock threshold |
| Stock status | Color indicator: green (healthy), yellow (low), red (out of stock) |
| "Restock" button per product | Opens quantity input modal |
| "Adjust" button per product | Opens exact-count input with reason field |
| Low-stock filter | Toggle to show only low-stock products |

**Restock flow:**
1. Tap "Restock" on a product
2. Enter quantity to add
3. Call `POST /api/inventory/seller/stock/{product_id}/restock/` with `{quantity}`
4. Update table optimistically

### 4. Order Management

Covered in detail in [orders.md](./orders.md) (seller section). The seller dashboard provides a tab/link to this screen.

### 5. Earnings & Settlements

#### Earnings Overview

| Element | Details |
|---------|---------|
| Summary cards | Total earned (gross), total commission, total net, total pending, total settled |
| Earnings list | Table: order number, product, gross, commission %, commission amount, net, status |
| Filter | Date range picker, status (pending/settled/disputed) |

#### Settlement History

| Element | Details |
|---------|---------|
| Settlement list | Table: period, total amount, # of orders, method (cash/mobile money), status, date settled |
| Settlement detail | Tap to see which earnings were included |

---

## Seller Waiting Screen (Not Yet Approved)

If the seller registered but hasn't been approved yet.

| Element | Details |
|---------|---------|
| Status message | "Your seller account is being reviewed" |
| What was submitted | Shop name, category, license info |
| Estimated time | "Review usually takes 1-3 business days" |
| Rejection notice | If rejected: show reason + "Update Information" button to fix and resubmit |

---

## Types

```typescript
export interface SellerProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: CategorySummary;
  primaryImage?: string;
  imagesCount: number;
  stock: number;
  reserved: number;
  available: number;
  isActive: boolean;
  isApproved: boolean;
  rejectionReason?: string;
  createdAt: string;
}

export interface StockInfo {
  productId: string;
  productName: string;
  quantity: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export interface SellerEarning {
  id: string;
  orderNumber: string;
  productName: string;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  status: 'pending' | 'settled' | 'disputed';
  createdAt: string;
}

export interface EarningsSummary {
  totalGross: number;
  totalCommission: number;
  totalNet: number;
  totalPending: number;
  totalSettled: number;
}

export interface Settlement {
  id: string;
  totalAmount: number;
  earningsCount: number;
  periodStart: string;
  periodEnd: string;
  method: 'cash' | 'mobile_money';
  status: 'pending' | 'completed' | 'failed';
  settledAt?: string;
}
```

---

## Routes

```typescript
export const SELLER_ROUTES = {
  DASHBOARD: "/seller",
  PRODUCTS: "/seller/products",
  ADD_PRODUCT: "/seller/products/new",
  EDIT_PRODUCT: (id: string) => `/seller/products/${id}/edit`,
  INVENTORY: "/seller/inventory",
  ORDERS: "/seller/orders",
  ORDER_DETAIL: (orderNumber: string) => `/seller/orders/${orderNumber}`,
  EARNINGS: "/seller/earnings",
  SETTLEMENTS: "/seller/settlements",
} as const;
```
