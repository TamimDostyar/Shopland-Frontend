# Database Architecture (Full System)

## Purpose

This document maps out the entire backend database schema so frontend developers understand the shape of the data they receive from the API, how entities relate to each other, and what fields exist on each model.

> **This is the target architecture.** Not all models are implemented yet. Backend docs in `Amazebid-Backend/docs/` describe the implementation status for each app.

---

## Complete Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                USERS & AUTH                                       │
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────┐               │
│  │                           User                                │               │
│  │  (extends AbstractBaseUser — email is the login field)        │               │
│  │                                                               │               │
│  │  id (UUID, PK)              email (unique, indexed)           │               │
│  │  password                   first_name                        │               │
│  │  last_name                  father_name                       │               │
│  │  phone_number (unique)      national_id (unique)              │               │
│  │  national_id_photo          profile_photo                     │               │
│  │  date_of_birth              role (buyer/seller/admin/driver)  │               │
│  │  is_active                  is_email_verified                 │               │
│  │  is_phone_verified          is_id_verified                    │               │
│  │  date_joined                last_login                        │               │
│  └──┬──────────┬──────────┬──────────┬───────────────────────────┘               │
│     │          │          │          │                                            │
│     │1:1       │1:1       │1:1       │1:1                                        │
│     ▼          ▼          ▼          ▼                                            │
│  ┌────────┐ ┌──────────────────────────────────┐ ┌─────────────────────────────┐ │
│  │ Buyer  │ │       SellerProfile               │ │       DriverProfile         │ │
│  │ Profile│ │                                    │ │                             │ │
│  │        │ │  user (1:1 FK, PK)                 │ │  user (1:1 FK, PK)          │ │
│  │ user   │ │  shop_name (unique)                │ │  vehicle_type               │ │
│  │ prefer │ │  shop_slug                         │ │  zone_city                  │ │
│  │ red_   │ │  business_description              │ │  zone_province              │ │
│  │ lang   │ │  business_phone                    │ │  is_available               │ │
│  │        │ │  business_license_no               │ │  total_deliveries           │ │
│  └────────┘ │  business_license_photo            │ │  rating                     │ │
│             │  shop_address_street               │ │  created_at                 │ │
│             │  shop_address_district              │ └─────────────────────────────┘ │
│             │  shop_address_city                  │                                 │
│             │  shop_address_province              │ ┌─────────────────────────────┐ │
│             │  shop_category                      │ │  NotificationPreference     │ │
│             │  logo                               │ │                             │ │
│             │  is_approved                        │ │  user (1:1 FK, PK)          │ │
│             │  approved_by (FK→User, nullable)    │ │  order_updates (non-disabl) │ │
│             │  approved_at                        │ │  messages (non-disableable) │ │
│             │  rejection_reason                   │ │  price_drops                │ │
│             │  commission_rate (default 10%)      │ │  back_in_stock              │ │
│             │  created_at                         │ │  new_reviews                │ │
│             └──────────────────────────────────────┘ │  low_stock                  │ │
│                                                      │  promotions (default False) │ │
│                                                      └─────────────────────────────┘ │
│                                                                                      │
│     ┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐ │
│     │      Address         │  │  WishlistItem    │  │  PhoneVerificationCode       │ │
│     │                      │  │                  │  │                              │ │
│     │  id (UUID)           │  │  id (UUID)       │  │  id (UUID)                   │ │
│     │  user (FK)           │  │  user (FK)       │  │  user (FK)                   │ │
│     │  label               │  │  product (FK)    │  │  code (6-digit)              │ │
│     │  full_name           │  │  price_when_     │  │  created_at                  │ │
│     │  phone_number        │  │    saved         │  │  expires_at (created + 5min) │ │
│     │  street_address      │  │  created_at      │  │  attempts (max 5)            │ │
│     │  district            │  │                  │  │  is_used                     │ │
│     │  city                │  │  unique:         │  │                              │ │
│     │  province            │  │  (user, product) │  │  resend cooldown: 60s        │ │
│     │  country (def: AF)   │  └──────────────────┘  │  max resends: 5/hr/phone     │ │
│     │  nearby_landmark     │                         └──────────────────────────────┘ │
│     │  is_default          │                                                         │
│     └──────────────────────┘                                                         │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                CATALOG                                            │
│                                                                                  │
│  ┌──────────────────┐          ┌──────────────┐                                  │
│  │    Category       │          │    Brand      │                                 │
│  │                   │          │              │                                  │
│  │  id (UUID)        │          │  id (UUID)   │                                  │
│  │  name             │          │  name (uniq) │                                  │
│  │  name_fa          │          │  slug        │                                  │
│  │  name_ps          │          │  logo        │                                  │
│  │  slug (unique)    │          │  is_active   │                                  │
│  │  parent (self FK) │──┐       └──────┬───────┘                                  │
│  │  image            │  │              │optional FK                               │
│  │  is_active        │  │self          │                                          │
│  │  display_order    │  │ref           │                                          │
│  │  created_at       │  │              │                                          │
│  └─────┬─────────────┘  └──┘           │                                          │
│        │FK                            │                                          │
│        ▼                              ▼                                           │
│  ┌──────────────────────────────────────────────────────┐                         │
│  │                      Product                          │                        │
│  │                                                       │                        │
│  │  id (UUID)                seller (FK→SellerProfile)   │                        │
│  │  category (FK)            brand (FK, nullable)        │                        │
│  │  name       name_fa       name_ps                     │                        │
│  │  slug (unique)            description                 │                        │
│  │  description_fa           description_ps              │                        │
│  │  price (AFN)              discount_price (nullable)   │                        │
│  │  condition (new/used/refurbished)                     │                        │
│  │  city       province                                  │                        │
│  │  is_active                is_approved                 │                        │
│  │  approved_by (FK→User)    rejection_reason            │                        │
│  │  views_count              created_at      updated_at  │                        │
│  └──┬──────────────┬──────────────┬──────────────────────┘                        │
│     │              │              │                                               │
│     │1:N           │1:N           │1:1                                            │
│     ▼              ▼              ▼                                               │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────┐                               │
│  │ Product   │  │  Question    │  │    Stock      │                               │
│  │ Image     │  │              │  │               │                               │
│  │           │  │  id          │  │  id           │                               │
│  │  id       │  │  product(FK) │  │  product(1:1) │                               │
│  │  product  │  │  asked_by(FK)│  │  quantity     │                               │
│  │  (FK)     │  │  body        │  │  reserved     │                               │
│  │  image    │  │  is_active   │  │  low_stock_   │                               │
│  │  alt_text │  │  created_at  │  │   threshold   │                               │
│  │  display_ │  └──────┬───────┘  │  updated_at   │                               │
│  │   order   │         │1:N       └───────┬───────┘                               │
│  │  is_prim  │         ▼                  │1:N                                    │
│  └───────────┘  ┌──────────────┐  ┌───────▼──────────┐                            │
│                 │   Answer     │  │  StockMovement   │                            │
│                 │              │  │                   │                            │
│                 │  id          │  │  id               │                            │
│                 │  question(FK)│  │  product (FK)     │                            │
│                 │  answered_by │  │  movement_type    │                            │
│                 │  body        │  │  quantity_change   │                            │
│                 │  is_seller_  │  │  quantity_after   │                            │
│                 │   answer     │  │  reason           │                            │
│                 │  is_active   │  │  reference_id     │                            │
│                 │  created_at  │  │  created_by (FK)  │                            │
│                 └──────────────┘  │  created_at       │                            │
│                                   └──────────────────┘                            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           CART & ORDERS                                           │
│                                                                                  │
│  ┌──────────────────┐                ┌──────────────────────────────────┐        │
│  │      Cart         │                │              Order               │        │
│  │                   │                │                                  │        │
│  │  id (UUID)        │                │  id (UUID)       order_number    │        │
│  │  buyer (1:1→User) │                │  buyer (FK→User)                 │        │
│  │  created_at       │                │  delivery_address (FK→Address)*  │        │
│  │  updated_at       │                │  delivery_phone                  │        │
│  └──────┬────────────┘                │  status          subtotal        │        │
│         │1:N                          │  delivery_fee    total           │        │
│         ▼                             │  buyer_notes                     │        │
│  ┌──────────────────┐                │  cancellation_reason              │        │
│  │    CartItem       │                │  cancelled_by                    │        │
│  │                   │                │  created_at      updated_at      │        │
│  │  cart (FK)        │                └──┬───────────────┬───────────────┘        │
│  │  product (FK)     │                   │1:N            │1:N                     │
│  │  quantity         │                   ▼               ▼                        │
│  │  added_at         │                ┌──────────────┐ ┌───────────────────┐      │
│  └──────────────────┘                │  OrderItem   │ │ OrderStatusHistory │      │
│                                      │              │ │                   │      │
│  unique: (cart, product)             │  order (FK)  │ │  order (FK)       │      │
│  price NOT stored in cart;           │  product(FK) │ │  old_status       │      │
│  computed from product at            │  seller (FK) │ │  new_status       │      │
│  checkout                            │  product_    │ │  changed_by (FK)  │      │
│                                      │   name       │ │  note             │      │
│  * delivery_address is a             │  product_    │ │  created_at       │      │
│    SNAPSHOT, not a live              │   price      │ └───────────────────┘      │
│    reference to Address              │  quantity    │                            │
│                                      │  subtotal    │                            │
│                                      └──────────────┘                            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         SHIPPING & DELIVERY                                       │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────┐                      │
│  │                    Shipment                             │                     │
│  │                                                        │                      │
│  │  id (UUID)                  order (1:1→Order)          │                      │
│  │  driver (FK→DriverProfile, nullable)                   │                      │
│  │  pickup_address (text)      pickup_phone               │                      │
│  │  delivery_address (text)    delivery_phone              │                      │
│  │  delivery_fee               status                     │                      │
│  │  assigned_at                picked_up_at               │                      │
│  │  delivered_at               estimated_delivery          │                      │
│  │  driver_notes               created_at                 │                      │
│  └──────────────┬─────────────────────────────────────────┘                      │
│                 │1:N                                                             │
│                 ▼                                                                │
│  ┌──────────────────────────────────┐                                            │
│  │       ShipmentTracking           │                                            │
│  │                                  │                                            │
│  │  id (UUID)      shipment (FK)    │                                            │
│  │  status         note             │                                            │
│  │  updated_by (FK→User) created_at │                                            │
│  └──────────────────────────────────┘                                            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         PAYMENTS (COD)                                            │
│                                                                                  │
│  ┌───────────────────────────────────────┐                                       │
│  │          CODCollection                 │                                      │
│  │                                        │                                      │
│  │  id (UUID)                             │                                      │
│  │  order (1:1→Order)                     │                                      │
│  │  amount_collected                      │                                      │
│  │  collected_by (FK→User, nullable)      │                                      │
│  │  collected_at                          │                                      │
│  │  delivered_to_platform (bool)          │                                      │
│  │  delivered_to_platform_at (datetime)   │                                      │
│  │  status (collected/delivered/verified) │                                      │
│  │  notes                                │                                      │
│  │  created_at                           │                                      │
│  └───────────────────────────────────────┘                                       │
│                                                                                  │
│  ┌───────────────────────────────────────┐    ┌──────────────────────────────┐   │
│  │         SellerEarning                  │    │        Settlement             │   │
│  │                                        │    │                              │   │
│  │  id (UUID)                             │    │  id (UUID)                   │   │
│  │  order_item (1:1→OrderItem)            │    │  seller (FK→SellerProfile)   │   │
│  │  seller (FK→SellerProfile)             │───▶│  total_amount                │   │
│  │  gross_amount     commission_rate      │    │  earnings_count              │   │
│  │  commission_amount  net_amount         │    │  period_start / period_end   │   │
│  │  status           settlement (FK)──────│    │  method (cash/mobile_money)  │   │
│  │  created_at                            │    │  settled_by (FK→User)        │   │
│  └────────────────────────────────────────┘    │  settled_at     status       │   │
│                                                │  notes          created_at   │   │
│  Earnings created on DELIVERY (not at order    └──────────────────────────────┘   │
│  placement). Commission on product price only.                                   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          REVIEWS                                                  │
│                                                                                  │
│  ┌──────────────────────────────────────────────┐                                │
│  │                 Review                        │                               │
│  │                                               │                               │
│  │  id (UUID)              product (FK→Product)  │                               │
│  │  buyer (FK→User)        order (FK→Order)      │                               │
│  │  rating (1-5)           title                 │                               │
│  │  body                   is_active             │                               │
│  │  created_at             updated_at            │                               │
│  └──────────────┬────────────────────────────────┘                               │
│                 │1:1                                                             │
│                 ▼                                                                │
│  ┌──────────────────────────────────┐                                            │
│  │        SellerResponse            │                                            │
│  │                                  │                                            │
│  │  id (UUID)     review (1:1→Rev)  │                                            │
│  │  seller (FK→SellerProfile)       │                                            │
│  │  body          created_at        │                                            │
│  └──────────────────────────────────┘                                            │
│                                                                                  │
│  unique: (product, buyer) — one review per product per buyer                     │
│  Reviews only allowed after order status = 'completed'                           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          MESSAGING                                                │
│                                                                                  │
│  ┌──────────────────────────────────────────────────┐                            │
│  │               Conversation                        │                           │
│  │                                                   │                           │
│  │  id (UUID)              buyer (FK→User)           │                           │
│  │  seller (FK→SellerProfile)                        │                           │
│  │  product (FK→Product, nullable)                   │                           │
│  │  order (FK→Order, nullable)                       │                           │
│  │  type (product/order/general)                     │                           │
│  │  is_active              last_message_at           │                           │
│  │  created_at                                       │                           │
│  └──────────────┬────────────────────────────────────┘                           │
│                 │1:N                                                             │
│                 ▼                                                                │
│  ┌──────────────────────────────────┐                                            │
│  │            Message               │                                            │
│  │                                  │                                            │
│  │  id (UUID)    conversation (FK)  │                                            │
│  │  sender (FK→User)               │                                            │
│  │  body (max 2000)                │                                            │
│  │  image (nullable, max 5MB)      │                                            │
│  │  is_read      created_at        │                                            │
│  └──────────────────────────────────┘                                            │
│                                                                                  │
│  unique: (buyer, seller, product) — one thread per buyer-seller-product          │
│  unique: (buyer, seller, order) — one thread per buyer-seller-order              │
│  Order messages: 30-day window after delivery                                    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATIONS                                             │
│                                                                                  │
│  ┌──────────────────────────────────────────────┐                                │
│  │            Notification                       │                               │
│  │                                               │                               │
│  │  id (UUID)              user (FK→User, idx)   │                               │
│  │  type (max 50)          title (max 200)       │                               │
│  │  body (max 500)         data (JSON, nullable) │                               │
│  │  is_read (indexed)      created_at (indexed)  │                               │
│  └───────────────────────────────────────────────┘                               │
│                                                                                  │
│  ┌──────────────────────────────────────────────┐                                │
│  │            DeviceToken                        │                               │
│  │                                               │                               │
│  │  id (UUID)              user (FK→User)        │                               │
│  │  token (unique, max 500)  platform            │                               │
│  │  is_active              created_at            │                               │
│  │  last_used_at (nullable)                      │                               │
│  └───────────────────────────────────────────────┘                               │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## Relationship Summary

Every foreign key relationship in the system and how entities connect.

| From | To | Relationship | Meaning |
|------|----|-------------|---------|
| `BuyerProfile` | `User` | 1:1 | Each buyer has one profile |
| `SellerProfile` | `User` | 1:1 | Each seller has one profile |
| `DriverProfile` | `User` | 1:1 | Each driver has one profile |
| `NotificationPreference` | `User` | 1:1 | Each user has one preference set |
| `Address` | `User` | N:1 | A user can have many addresses |
| `WishlistItem` | `User` | N:1 | A user can have many wishlist items |
| `WishlistItem` | `Product` | N:1 | A product can be wishlisted by many users |
| `PhoneVerificationCode` | `User` | N:1 | A user can have many codes (only latest active) |
| `Category.parent` | `Category` | Self-ref | Categories nest (Electronics > Phones) |
| `Product` | `Category` | N:1 | A product belongs to one category |
| `Product` | `Brand` | N:1 (nullable) | A product optionally belongs to a brand |
| `Product` | `SellerProfile` | N:1 | A product belongs to one seller |
| `ProductImage` | `Product` | N:1 | A product has many images |
| `Question` | `Product` | N:1 | A product can have many questions |
| `Question` | `User` | N:1 | A user asks many questions |
| `Answer` | `Question` | N:1 | A question can have many answers |
| `Answer` | `User` | N:1 | A user writes many answers |
| `Stock` | `Product` | 1:1 | Each product has one stock record |
| `StockMovement` | `Product` | N:1 | A product has many stock movements |
| `StockMovement` | `User` | N:1 (nullable) | Who performed the stock change |
| `Cart` | `User` | 1:1 | Each buyer has one cart |
| `CartItem` | `Cart` | N:1 | A cart has many items |
| `CartItem` | `Product` | N:1 | An item references one product |
| `Order` | `User` | N:1 | A buyer can have many orders |
| `Order` | `Address` | N:1 | An order delivers to one address (snapshot at order time) |
| `OrderItem` | `Order` | N:1 | An order has many items |
| `OrderItem` | `Product` | N:1 (nullable) | An item references a product (null if deleted) |
| `OrderItem` | `SellerProfile` | N:1 | An item belongs to one seller |
| `OrderStatusHistory` | `Order` | N:1 | An order has many status changes |
| `Shipment` | `Order` | 1:1 | Each order has one shipment |
| `Shipment` | `DriverProfile` | N:1 (nullable) | A driver handles many shipments |
| `ShipmentTracking` | `Shipment` | N:1 | A shipment has many tracking events |
| `CODCollection` | `Order` | 1:1 | Each order has one cash collection record |
| `SellerEarning` | `OrderItem` | 1:1 | Each order item generates one earning |
| `SellerEarning` | `SellerProfile` | N:1 | A seller has many earnings |
| `SellerEarning` | `Settlement` | N:1 (nullable) | An earning belongs to one settlement batch |
| `Settlement` | `SellerProfile` | N:1 | A seller has many settlements |
| `Review` | `Product` | N:1 | A product has many reviews |
| `Review` | `User` | N:1 | A buyer writes many reviews |
| `Review` | `Order` | N:1 | A review is linked to a specific order |
| `SellerResponse` | `Review` | 1:1 | Each review has at most one seller response |
| `Conversation` | `User` | N:1 | A buyer can have many conversations |
| `Conversation` | `SellerProfile` | N:1 | A seller can have many conversations |
| `Conversation` | `Product` | N:1 (nullable) | Optionally about a product |
| `Conversation` | `Order` | N:1 (nullable) | Optionally about an order |
| `Message` | `Conversation` | N:1 | A conversation has many messages |
| `Message` | `User` | N:1 | A user sends many messages |
| `Notification` | `User` | N:1 | A user receives many notifications |
| `DeviceToken` | `User` | N:1 | A user has tokens for many devices |

---

## Model Count by App

| App | Models | Tables |
|-----|--------|--------|
| `users` | User, BuyerProfile, SellerProfile, Address, PhoneVerificationCode, WishlistItem | 6 |
| `catalog` | Category, Brand, Product, ProductImage, Question, Answer | 6 |
| `inventory` | Stock, StockMovement | 2 |
| `cart` | Cart, CartItem | 2 |
| `orders` | Order, OrderItem, OrderStatusHistory | 3 |
| `shipping` | DriverProfile, Shipment, ShipmentTracking | 3 |
| `payments` | CODCollection, SellerEarning, Settlement | 3 |
| `reviews` | Review, SellerResponse | 2 |
| `messaging` | Conversation, Message | 2 |
| `notifications` | Notification, DeviceToken, NotificationPreference | 3 |
| **Total** | | **32 tables** |

---

## How This Maps to the Frontend

### What each role sees

| Data | Buyer sees | Seller sees | Admin sees |
|------|-----------|-------------|------------|
| User | Own profile only | Own profile only | All users |
| Products | All approved + active | Own products (all statuses) | All products |
| Cart | Own cart | N/A | N/A |
| Orders | Own orders | Orders containing their products | All orders |
| Reviews | All (on products), own (to edit) | Reviews on their products | All reviews |
| Messages | Own conversations | Own conversations | All conversations |
| Notifications | Own notifications | Own notifications | Own + broadcast |
| Stock | N/A (sees "in stock" / "out of stock") | Own products' stock | All stock |
| Earnings | N/A | Own earnings + settlements | All earnings |
| Shipments | Own orders' tracking | N/A | All shipments |

### Sensitive data restrictions

National ID photos, national ID numbers, and profile photos are **sensitive PII**. The API never exposes these in public responses. Only the user themselves and admins can access ID-related fields. Public API responses (e.g. product seller info, reviews) use shop names, not personal names.

### API response nesting

The API returns nested data, not raw foreign keys. For example, a product response includes:

```json
{
  "id": "uuid",
  "name": "Samsung Galaxy A54",
  "price": 22000,
  "category": {
    "id": "uuid",
    "name": "Phones",
    "slug": "phones"
  },
  "seller": {
    "id": "uuid",
    "shopName": "Tech Kabul",
    "rating": 4.5
  },
  "images": [
    {"id": "uuid", "image": "/media/...", "isPrimary": true}
  ],
  "inStock": true,
  "averageRating": 4.2,
  "reviewCount": 128
}
```

Computed fields like `inStock`, `averageRating`, and `reviewCount` are calculated by the backend and included in the response -- the frontend never calculates these from raw data. `inStock` is derived from `Stock.quantity - Stock.reserved > 0`.

---

## Key Constraints the Frontend Must Respect

### Identity & Access

| Constraint | Enforcement |
|------------|-------------|
| Unique email, phone, national ID | Registration returns field-level errors on duplicates |
| Staged access after registration | `Nothing verified` → can log in, see verification status. `Phone + email verified` → browse, add to cart. `Phone + email + ID verified` → place orders, leave reviews. `All above + seller approved` → list products. |
| Seller must be approved | API returns 403 if unapproved seller tries to create products or access seller endpoints |
| Buyer must be fully verified for checkout | API returns 403 with `verification_status` showing what's missing |

### Phone / Email Verification

| Constraint | Enforcement |
|------------|-------------|
| Phone code expires in 5 minutes | API returns error if code is expired |
| Max 5 wrong phone code attempts | Code invalidated after 5 failures; must request new one |
| 60-second resend cooldown | API returns 429 if resend requested too soon |
| Max 5 resends per hour per phone | API returns 429 to prevent SMS cost abuse |
| Email link expires in 24 hours | API returns error if token is expired |

### Cart & Checkout

| Constraint | Enforcement |
|------------|-------------|
| One cart per buyer | API always returns the same cart for a user |
| Seller cannot buy own products | API returns 400 if seller adds own product to cart |
| Price not stored in cart | Cart items reference the product; price is computed at checkout from the product's current price |
| Stock + product re-validated at checkout | API rejects checkout if product became inactive, unapproved, or out of stock since it was added to cart |
| Stock cannot go negative | Add-to-cart and checkout reject if insufficient stock (`quantity - reserved < requested`) |

### Orders

| Constraint | Enforcement |
|------------|-------------|
| Order status transitions are strict | API rejects invalid transitions (e.g. `pending` → `delivered`) |
| Cancellation before `out_for_delivery` | Buyer or seller can cancel. After pickup, only admin can cancel. |
| Address is snapshotted at order time | Changing an address later does not affect existing orders |

### Reviews & Q&A

| Constraint | Enforcement |
|------------|-------------|
| One review per product per buyer | API returns 400 on duplicate |
| Reviews only after order `completed` | API returns 403 if order is not in `completed` status |
| Q&A requires phone verification | API returns 403 if `is_phone_verified = False` |

### Messaging

| Constraint | Enforcement |
|------------|-------------|
| Buyer must be phone-verified to message | API returns 403 |
| Seller must be approved to message | API returns 403 |
| One conversation per buyer-seller-product | Starting a new one reopens the existing thread |
| One conversation per buyer-seller-order | Same as above for order threads |
| Order messages: 30-day window | API returns 403 if conversation is for an order delivered > 30 days ago |
| No phone numbers or URLs in messages | Content filtered server-side |

### Wishlist & Notifications

| Constraint | Enforcement |
|------------|-------------|
| Wishlist unique per product per user | Adding same product twice is a no-op (idempotent) |
| Deleted products stay in wishlist | Shown as "unavailable" rather than silently removed |
| `order_updates` and `messages` notification prefs cannot be disabled | API ignores attempts to set them to `false` |

### Payments

| Constraint | Enforcement |
|------------|-------------|
| Commission calculated on product price only | Delivery fees are excluded from commission |
| Commission rate snapshotted at order time | Uses seller's `commission_rate` at time of order, stored on each `SellerEarning` |
| Earnings created on delivery, not order placement | `SellerEarning` rows only appear when cash is collected |
| Disputed earnings excluded from settlement | `status = 'disputed'` earnings are skipped when creating `Settlement` batches |
