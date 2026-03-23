# Catalog & Product Browsing

## Purpose

This document covers how buyers browse, search, and view products. The catalog is the main experience for buyers -- it's the homepage, the search results, and the product detail pages.

---

## Backend Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/catalog/products/` | GET | List products (paginated, filterable) |
| `/api/catalog/products/{slug}/` | GET | Product detail |
| `/api/catalog/categories/` | GET | Category tree |
| `/api/catalog/categories/{slug}/` | GET | Category detail with products |
| `/api/catalog/brands/` | GET | Brand list |
| `/api/catalog/search/?q=` | GET | Full-text search |

---

## Screens

### 1. Home Screen

The main landing page for logged-in (or browsing) users.

**Layout:**

| Section | Content |
|---------|---------|
| Header | Search bar, cart icon (with badge count), profile/login button |
| Category bar | Horizontal scrollable list of top-level categories with icons |
| Featured products | Curated or popular products in a grid/carousel |
| Recently added | Newest products, sorted by `created_at` |
| Browse by city | Products near the user's city (from their default address) |

**Data fetching:**
- `GET /api/catalog/categories/` for category bar
- `GET /api/catalog/products/?sort=newest&limit=10` for recently added
- `GET /api/catalog/products/?sort=most_viewed&limit=10` for featured
- `GET /api/catalog/products/?city=Kabul&limit=10` for local products (if user is logged in)

### 2. Category Page

When a user taps a category.

| Element | Details |
|---------|---------|
| Category header | Category name (in user's language), image |
| Subcategories | If the category has children, show them as a horizontal row |
| Product grid | Products in this category, paginated |
| Filter sidebar/sheet | Price range, condition, city, province, brand |
| Sort dropdown | Newest, price low-high, price high-low, most viewed |
| Empty state | "No products in this category yet" |

**Data fetching:**
- `GET /api/catalog/categories/{slug}/` for category info + subcategories
- `GET /api/catalog/products/?category={slug}&sort=newest` for products

### 3. Search Results

When a user types in the search bar and submits.

| Element | Details |
|---------|---------|
| Search input | Pre-filled with query, clearable |
| Result count | "42 results for 'laptop'" |
| Product grid | Matching products, paginated |
| Filter sidebar/sheet | Same as category page |
| Sort dropdown | Relevance (default), price, newest |
| Empty state | "No results for '...'. Try a different search." |
| Suggestions | "Did you mean...?" (future enhancement) |

**Data fetching:**
- `GET /api/catalog/search/?q={query}&sort=relevance`

**Search UX:**
- Debounce search input (300ms) to avoid excessive API calls
- Show search history (stored locally) below the input when focused
- On mobile: full-screen search overlay with keyboard auto-focused

### 4. Product Detail Page

The most important conversion page -- this is where a buyer decides to add to cart.

**Layout:**

| Section | Content |
|---------|---------|
| Image gallery | Primary image large, thumbnails below. Tap to zoom/fullscreen. Swipeable on mobile |
| Product title | Product name in the user's language |
| Price | Current price in AFN. If discounted: show original price with strikethrough + discount price + savings percentage |
| Seller info | Shop name, shop logo, seller rating (stars + count), link to seller's storefront |
| Product details | Description, condition (new/used/refurbished), location (city, province) |
| Stock status | "In Stock" (green) or "Out of Stock" (red/gray) |
| Quantity selector | +/- buttons, constrained by available stock |
| "Add to Cart" button | Primary action, disabled if out of stock |
| Reviews section | Average rating, review count, most recent reviews, "See all reviews" link |
| Related products | Products in the same category, horizontal scroll |

**Data fetching:**
- `GET /api/catalog/products/{slug}/` for all product data
- Reviews are embedded in the product response or fetched separately from `/api/reviews/products/{product_id}/reviews/`

**Interaction:**
- "Add to Cart" calls `POST /api/cart/items/` with `{product_id, quantity}`
- Show success toast: "Added to cart" with a "View Cart" link
- If not logged in: redirect to login, then return to this page after auth

### 5. Seller Storefront

When a buyer taps on a seller's name from a product page.

| Element | Details |
|---------|---------|
| Shop header | Logo, shop name, category, rating, total reviews |
| Shop description | Business description |
| Product grid | All products from this seller, filterable and sortable |
| Contact info | Business phone (tap to call on mobile) |

---

## Product Card Component

The reusable product card shown in grids throughout the app.

| Element | Details |
|---------|---------|
| Primary image | Product's primary image, lazy loaded |
| Product name | Truncated to 2 lines |
| Price | AFN formatted. If discounted: show both prices |
| Seller name | Small text below price |
| Rating | Stars + review count (if any) |
| Location badge | City name (small, bottom corner) |
| Stock badge | "Out of Stock" overlay if unavailable |

---

## Filtering & Sorting

### Filter Parameters

| Filter | UI Element | API Parameter |
|--------|-----------|---------------|
| Category | Category bar or sidebar link | `?category=electronics` |
| Price range | Dual-handle slider | `?min_price=500&max_price=5000` |
| Condition | Checkbox group (New, Used, Refurbished) | `?condition=new` |
| City | Dropdown or text input | `?city=Kabul` |
| Province | Dropdown (34 provinces) | `?province=Kabul` |
| Brand | Checkbox list | `?brand=samsung` |

### Sort Options

| Label | API Parameter |
|-------|---------------|
| Newest | `?sort=newest` |
| Price: Low to High | `?sort=price_asc` |
| Price: High to Low | `?sort=price_desc` |
| Most Viewed | `?sort=most_viewed` |

### Pagination

- Infinite scroll on mobile (load next page when near bottom)
- Page numbers on web/desktop
- Default 20 items per page

---

## Localization

Product names and descriptions can have translations in Dari, Pashto, and English. The frontend should:

1. Check the user's selected language
2. Display the translated field if available (e.g. `name_fa` for Dari)
3. Fall back to the default `name` field if no translation exists

---

## Platform-Specific Notes

| Feature | Web | Desktop | Mobile |
|---------|-----|---------|--------|
| Image gallery | Lightbox on click | Lightbox on click | Fullscreen swipeable viewer |
| Search | Top bar, always visible | Top bar, always visible | Full-screen overlay on tap |
| Filters | Sidebar panel | Sidebar panel | Bottom sheet |
| Product grid | 3-4 columns | 3-4 columns | 2 columns |
| Infinite scroll | Optional (page numbers) | Optional (page numbers) | Default |
| Share product | Copy link | Copy link | Native share sheet |

---

## Shared Types Needed

```typescript
export interface Product {
  id: string;
  slug: string;
  name: string;
  nameFa?: string;
  namePs?: string;
  description: string;
  descriptionFa?: string;
  descriptionPs?: string;
  price: number;
  discountPrice?: number;
  condition: 'new' | 'used' | 'refurbished';
  category: CategorySummary;
  brand?: BrandSummary;
  seller: SellerSummary;
  primaryImage: string;
  images: ProductImage[];
  city: string;
  province: string;
  inStock: boolean;
  availableQuantity: number;
  averageRating: number;
  reviewCount: number;
  viewsCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameFa?: string;
  namePs?: string;
  image?: string;
  parent?: CategorySummary;
  children: CategorySummary[];
}

export interface CategorySummary {
  id: string;
  slug: string;
  name: string;
}

export interface BrandSummary {
  id: string;
  slug: string;
  name: string;
}

export interface SellerSummary {
  id: string;
  shopName: string;
  shopSlug: string;
  logo?: string;
  averageRating: number;
  totalReviews: number;
}

export interface ProductImage {
  id: string;
  image: string;
  altText?: string;
  isPrimary: boolean;
}
```

---

## Routes

```typescript
export const CATALOG_ROUTES = {
  HOME: "/",
  CATEGORY: (slug: string) => `/category/${slug}`,
  SEARCH: "/search",
  PRODUCT: (slug: string) => `/product/${slug}`,
  SELLER: (slug: string) => `/shop/${slug}`,
} as const;
```
