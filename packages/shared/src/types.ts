export type ProductCondition = "new" | "used" | "refurbished";

export type CategorySummary = {
  id: string;
  slug: string;
  name: string;
  name_fa?: string;
  name_ps?: string;
};

export type BrandSummary = {
  id: string;
  slug: string;
  name: string;
};

export type SellerSummary = {
  id: string;
  shop_name: string;
  shop_slug: string;
  logo?: string | null;
  average_rating?: number;
  total_reviews?: number;
};

export type ProductImage = {
  id: string;
  image: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
};

export type ProductColor = {
  id: string;
  name: string;
  name_fa?: string;
  name_ps?: string;
  hex_code: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  name_fa?: string;
  name_ps?: string;
  description: string;
  description_fa?: string;
  description_ps?: string;
  price: string;
  discount_price?: string | null;
  condition: ProductCondition;
  category: CategorySummary;
  brand?: BrandSummary | null;
  seller: SellerSummary;
  city: string;
  province: string;
  is_active: boolean;
  is_approved: boolean;
  rejection_reason?: string | null;
  views_count: number;
  colors: ProductColor[];
  images: ProductImage[];
  primary_image?: string | null;
  in_stock?: boolean;
  available_quantity?: number;
  average_rating?: number;
  review_count?: number;
  created_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  name_fa?: string;
  name_ps?: string;
  image?: string | null;
  parent?: CategorySummary | null;
  children: CategorySummary[];
  is_active: boolean;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  logo?: string | null;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ProductFilters = {
  category?: string;
  min_price?: number;
  max_price?: number;
  city?: string;
  province?: string;
  condition?: string;
  brand?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "most_viewed";
  q?: string;
  page?: number;
  limit?: number;
};

// ─── Cart ──────────────────────────────────────────────────────────────────

export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: string;
  discount_price?: string | null;
  primary_image?: string | null;
  seller: { shop_name: string; shop_slug: string };
  in_stock: boolean;
  available_quantity: number;
};

export type CartItem = {
  id: string;
  product: CartProduct;
  quantity: number;
  item_total: string;
};

export type Cart = {
  items: CartItem[];
  items_count: number;
  subtotal: string;
  total: string;
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "processing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "completed"
  | "cancelled_by_buyer"
  | "cancelled_by_seller"
  | "cancelled_by_admin";

export type OrderStatusEntry = {
  old_status: string;
  new_status: string;
  note?: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  product?: { id: string; slug: string; primary_image?: string | null } | null;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
  seller?: SellerSummary;
  seller_shop?: string;
};

export type Order = {
  id: string;
  order_number: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: string;
  delivery_fee: string;
  total: string;
  delivery_address?: Address;
  delivery_address_display?: {
    full_name: string;
    phone?: string;
    street?: string;
    district?: string;
    city?: string;
    province?: string;
  };
  delivery_phone: string;
  buyer_notes?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  status_history: OrderStatusEntry[];
  created_at: string;
  updated_at: string;
};

// ─── Inventory ──────────────────────────────────────────────────────────────

export type StockInfo = {
  product_id: string;
  product_name: string;
  quantity: number;
  reserved: number;
  available: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
};

// ─── Earnings ────────────────────────────────────────────────────────────────

export type SellerEarning = {
  id: string;
  order_number: string;
  product_name: string;
  gross_amount: string;
  commission_rate: string;
  commission_amount: string;
  net_amount: string;
  status: "pending" | "settled" | "disputed";
  created_at: string;
};

export type EarningsSummary = {
  total_gross: string;
  total_commission: string;
  total_net: string;
  total_pending: string;
  total_settled: string;
};

export type Settlement = {
  id: string;
  total_amount: string;
  earnings_count: number;
  period_start: string;
  period_end: string;
  method: "cash" | "mobile_money";
  status: "pending" | "completed" | "failed";
  settled_at?: string | null;
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export type Review = {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

// ─── Notifications ────────────────────────────────────────────────────────────

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  related_url?: string | null;
};

export type Platform = "web" | "desktop" | "ios" | "android";

export type Locale = "en" | "fa" | "ps";

export type LocaleMeta = {
  label: string;
  dir: "ltr" | "rtl";
};

export type GoalItem = {
  title: string;
  detail: string;
};

export type ComingSoonContent = {
  badge: string;
  title: string;
  subtitle: string;
  goals: GoalItem[];
  formTitle: string;
  namePlaceholder: string;
  usernamePlaceholder: string;
  ctaLabel: string;
  privacyNote: string;
  successMessage: string;
  duplicateMessage: string;
  errorMessage: string;
  footerEmail: string;
};

export type WaitlistResponse = {
  detail: string;
  already_joined: boolean;
};

// ─── Auth / User ──────────────────────────────────────────────────────────────

export type UserRole = "buyer" | "seller" | "admin";

export type VerificationStatus = {
  phone?: boolean;
  email: boolean;
  id: boolean;
  seller_approved?: boolean;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  father_name: string;
  phone_number: string | null;
  date_of_birth: string | null;
  role: UserRole;
  is_active: boolean;
  is_email_verified: boolean;
  is_selfie_verified: boolean;
  verification_status: VerificationStatus;
};

export type AuthResponse = {
  access: string;
  refresh: string;
  user: User;
};

export type TokenRefreshResponse = {
  access: string;
};

// ─── Address ──────────────────────────────────────────────────────────────────

export type Address = {
  id: string;
  label: string;
  full_name: string;
  phone_number: string;
  street_address: string;
  district: string;
  city: string;
  province: string;
  country: string;
  nearby_landmark: string;
  is_default: boolean;
};

// ─── Registration ─────────────────────────────────────────────────────────────

export type BuyerRegistrationData = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  father_name?: string;
  phone_number: number;
  profile_photo: File;
  date_of_birth: string;
  // Address (field names match backend serializer exactly)
  address_label: string;
  address_full_name: string;
  address_phone_number: number;
  address_street: string;
  address_district: string;
  address_city: string;
  address_province: string;
  address_nearby_landmark?: string;
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export type AdminUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  father_name: string;
  phone_number: string | null;
  profile_photo: string | null;
  date_of_birth: string | null;
  role: UserRole;
  is_active: boolean;
  is_email_verified: boolean;
  is_selfie_verified: boolean;
  date_joined: string;
  verification_status: VerificationStatus;
};

export type AdminSeller = {
  user: AdminUser;
  shop_name: string;
  shop_slug: string;
  shop_category: string;
  business_description: string;
  logo: string | null;
  business_phone: string;
  shop_address_street: string;
  shop_address_district: string;
  shop_address_city: string;
  shop_address_province: string;
  is_approved: boolean;
  approved_at: string | null;
  rejection_reason: string;
  commission_rate: string;
  created_at: string;
};

export type SellerStatus = "pending" | "approved" | "rejected";

// ─── Registration ─────────────────────────────────────────────────────────────

export type SellerRegistrationData = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  father_name?: string;
  phone_number: number;
  profile_photo: File;
  date_of_birth: string;
  // Shop
  shop_name: string;
  shop_category?: string;
  business_description?: string;
  business_phone: number;
  shop_address_street: string;
  shop_address_district: string;
  shop_address_city: string;
  shop_address_province: string;
};
