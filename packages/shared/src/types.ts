export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  sellerId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

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
  emailPlaceholder: string;
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
