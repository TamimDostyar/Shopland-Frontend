import type { Locale } from "./types";
import { categorySlugFallback } from "./i18n/categorySlugFallbacks";

/**
 * Category title for the current locale. All logic runs in the frontend.
 * Order: API `name_fa` / `name_ps` when present, else slug → label from
 * `categorySlugFallbacks` (no backend migration or DB fields required for that path), else English `name`.
 */
export function localizedCategoryName(
  cat: { name: string; name_fa?: string; name_ps?: string; slug?: string } | null | undefined,
  locale: Locale,
): string {
  if (!cat) return "";
  if (locale === "fa" && cat.name_fa?.trim()) return cat.name_fa;
  if (locale === "ps" && cat.name_ps?.trim()) return cat.name_ps;
  if (cat.slug) {
    const fromSlug = categorySlugFallback(cat.slug, locale);
    if (fromSlug) return fromSlug;
  }
  return cat.name;
}

export function localizedProductName(
  product: { name: string; name_fa?: string; name_ps?: string },
  locale: Locale,
): string {
  if (locale === "fa" && product.name_fa) return product.name_fa;
  if (locale === "ps" && product.name_ps) return product.name_ps;
  return product.name;
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function truncate(text: string, maxLength: number = 100): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}
