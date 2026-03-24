# Seller Storefront (Public Page)

## Access

Public -- no login required. This is the seller's public-facing shop page that buyers visit.

### URL: `/shop/{slug}`

---

## Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [Header]                                                      │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  [Shop Logo]                                               ││
│  │                                                            ││
│  │  Tech Kabul                                                ││
│  │  Electronics                                               ││
│  │  📍 Kabul, Kabul Province                                   ││
│  │  📅 Selling since March 2026                                ││
│  │                                                            ││
│  │  ★★★★☆ 4.5 (342 reviews)                                  ││
│  │                                                            ││
│  │  [💬 Message Seller]                                       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ── About ────────────────────────────────────────────────     │
│  "We sell genuine electronics imported from Dubai.             │
│   Free warranty on all phones. Serving Kabul since 2020."      │
│                                                                │
│  ── Products (48) ────────────────────────────────────────     │
│                                                                │
│  [Sort: Newest ▼]   [Filter by category ▼]                    │
│                                                                │
│  [Product Card] [Product Card] [Product Card] [Product Card]   │
│  [Product Card] [Product Card] [Product Card] [Product Card]   │
│  [Product Card] [Product Card] [Product Card] [Product Card]   │
│                                                                │
│  [Load More / Page 2]                                          │
│                                                                │
│  ── Customer Reviews ─────────────────────────────────────     │
│  ★★★★☆ 4.5 average across all products                        │
│                                                                │
│  [Review Card] [Review Card] [Review Card]                     │
│                                [See All Reviews →]             │
│                                                                │
│  [Footer]                                                      │
└────────────────────────────────────────────────────────────────┘
```

---

## Section Details

### Shop Header

| Element | Details |
|---------|---------|
| Logo | Shop logo image, fallback to first letter of shop name |
| Shop name | Large text |
| Category | "Electronics", "Clothing", etc. |
| Location | City and province |
| Member since | "Selling since {month year}" |
| Rating | Stars + total reviews across all products |
| "Message Seller" | Opens messaging (requires login) |

### About Section

| Element | Details |
|---------|---------|
| Description | Seller's business description. Shown in user's preferred language if translated |
| Truncation | If long, truncate with "Read More" |

### Products Grid

| Element | Details |
|---------|---------|
| Count | "Products (48)" |
| Default sort | Newest first |
| Sort options | Newest, Price low-high, Price high-low, Most viewed |
| Filter | By category (only categories this seller has products in) |
| Cards | Standard product cards |
| Pagination | Load more button or page numbers |

### Reviews Section

| Element | Details |
|---------|---------|
| Average | Aggregate rating across all the seller's products |
| Recent reviews | 3 most recent |
| "See All" | Routes to a page listing all reviews for this seller |

---

## Seller Trust Indicators (Future)

| Badge | Criteria |
|-------|---------|
| ✅ Verified Seller | ID and business license verified by admin |
| ⭐ Top Rated | Average rating >= 4.5 with 50+ reviews |
| 🚀 Fast Shipper | 90%+ orders marked ready for pickup within 24 hours |
| 🏆 Established | Selling for 6+ months with 100+ completed orders |
