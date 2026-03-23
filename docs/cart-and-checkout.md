# Cart & Checkout

## Purpose

This document covers the shopping cart UI and the checkout flow. The cart is where buyers manage items before purchasing, and checkout is where they confirm their order for cash-on-delivery.

---

## Backend Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cart/` | GET | Get current cart with items and totals |
| `/api/cart/items/` | POST | Add item to cart |
| `/api/cart/items/{item_id}/` | PATCH | Update quantity |
| `/api/cart/items/{item_id}/` | DELETE | Remove item |
| `/api/cart/clear/` | DELETE | Clear entire cart |
| `/api/orders/checkout/` | POST | Place order from cart |
| `/api/users/me/addresses/` | GET | Get saved addresses for checkout |

---

## Screens

### 1. Cart Icon (Global)

A cart icon visible in the header/navigation across all screens.

| Element | Details |
|---------|---------|
| Cart icon | Shopping bag/cart icon |
| Badge count | Number of items in cart (0 = no badge). Fetched from `GET /api/cart/` on login and cached |
| Tap behavior | Routes to cart screen |

Update the badge count whenever:
- An item is added to cart (optimistic update)
- Cart is fetched/refreshed
- An item is removed

### 2. Cart Screen

The full cart view.

**Empty state:**

| Element | Details |
|---------|---------|
| Illustration | Empty cart illustration |
| Message | "Your cart is empty" |
| CTA button | "Browse Products" -> routes to home |

**With items:**

| Element | Details |
|---------|---------|
| Item list | Each item as a card (see Cart Item Component below) |
| Cart summary | Subtotal, delivery fee estimate, total |
| "Clear Cart" button | Confirm dialog -> `DELETE /api/cart/clear/` |
| "Proceed to Checkout" button | Primary CTA, routes to checkout |
| "Continue Shopping" link | Routes back to home/last category |

**Cart Item Component:**

| Element | Details |
|---------|---------|
| Product image | Thumbnail (primary image) |
| Product name | Truncated to 2 lines, tappable -> product detail |
| Seller name | Small text |
| Unit price | Price per item in AFN |
| Quantity control | - button, quantity number, + button |
| Item total | Unit price x quantity |
| Remove button | Trash icon, confirm dialog before removal |
| Out of stock warning | If product became unavailable since adding, show red warning |

**Quantity update flow:**
1. User taps +/- button
2. Optimistically update UI
3. Call `PATCH /api/cart/items/{item_id}/` with `{quantity}`
4. On error: revert UI, show toast ("Not enough stock" or "Update failed")

**Price display:**
- Prices are NOT stored in the cart -- always show the current product price
- If a product has a `discountPrice`, show that with the original struck through
- Cart total is computed from the API response (server-side calculation)

### 3. Checkout Screen

The final step before placing an order. Only accessible to fully verified buyers (phone + email + ID verified).

**Access gate:** If the buyer is not fully verified, show a message explaining what's still needed instead of the checkout form.

**Layout:**

**Section 1: Delivery Address**

| Element | Details |
|---------|---------|
| Default address | Pre-selected, shown as a card with full address details |
| "Change Address" button | Opens address selector (list of saved addresses) |
| "Add New Address" button | Opens address form inline or as a modal |
| Delivery phone | Shown from the selected address, editable |

**Section 2: Order Summary**

| Element | Details |
|---------|---------|
| Item list | Compact view: image, name, quantity, price (not editable here) |
| Subtotal | Sum of all items |
| Delivery fee | Calculated based on seller location vs buyer address |
| Total | Subtotal + delivery fee. **This is what the buyer pays in cash.** |

**Section 3: Payment Method**

| Element | Details |
|---------|---------|
| Payment badge | "Cash on Delivery" with COD icon -- not selectable, just informational |
| Explanation | "You will pay AFN {total} in cash when your order is delivered" |

**Section 4: Buyer Notes**

| Element | Details |
|---------|---------|
| Textarea | Optional, placeholder: "Any special instructions for the seller or driver?" |

**Section 5: Place Order**

| Element | Details |
|---------|---------|
| "Place Order" button | Primary CTA, full width |
| Terms agreement | Small text: "By placing this order you agree to our Terms of Service" |

**Checkout submit flow:**

1. User taps "Place Order"
2. Show loading state on button (disable double-tap)
3. Call `POST /api/orders/checkout/` with:
   ```json
   {
     "delivery_address_id": "address-uuid",
     "delivery_phone": "+93XXXXXXXXX",
     "buyer_notes": "optional notes"
   }
   ```
4. **On success:**
   - Show order confirmation screen with order number
   - Clear cart badge
   - Cart is cleared server-side
5. **On error:**
   - Stock unavailable: show which items are out of stock, offer to remove them
   - Verification incomplete: show which step is missing
   - Generic error: show retry option

### 4. Order Confirmation Screen

Shown immediately after a successful checkout.

| Element | Details |
|---------|---------|
| Success icon | Green checkmark animation |
| Order number | `SL-20260323-0042` (large, prominent) |
| Message | "Your order has been placed! The seller will review it shortly." |
| Total | "You will pay AFN {total} in cash on delivery" |
| Delivery address | Summary of where it will be delivered |
| "Track Order" button | Routes to order detail screen |
| "Continue Shopping" button | Routes to home |

---

## Cart State Management

The cart can be managed with server state (React Query) or a combination of server + local state:

```typescript
interface CartState {
  items: CartItem[];
  itemsCount: number;
  total: number;
}

interface CartItem {
  id: string;
  product: CartProduct;
  quantity: number;
  itemTotal: number;
}

interface CartProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number;
  primaryImage: string;
  seller: { shopName: string };
  inStock: boolean;
  availableQuantity: number;
}
```

**Recommended approach:**
- Use React Query to fetch and cache the cart from the API
- Optimistic updates for quantity changes and removals
- Invalidate cart query after add/remove/clear operations
- Refetch cart on checkout screen mount (ensures fresh stock data)

---

## Platform-Specific Notes

| Feature | Web | Desktop | Mobile |
|---------|-----|---------|--------|
| Cart screen | Full page | Full page | Full screen with back nav |
| Quantity control | Click buttons | Click buttons | Tap buttons, haptic feedback |
| Checkout form | Single scrollable page | Single scrollable page | Stepper (address -> summary -> confirm) |
| Address selector | Dropdown or modal | Dropdown or modal | Bottom sheet |
| Order confirmation | Page with animations | Page with animations | Full screen with confetti/animation |

---

## Routes

```typescript
export const CART_ROUTES = {
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: (orderNumber: string) => `/order-confirmed/${orderNumber}`,
} as const;
```
