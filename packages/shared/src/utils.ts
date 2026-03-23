import type { Product } from "./types";

export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
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

export function sortProducts(
  products: Product[],
  by: "price" | "date" | "title" = "date",
  order: "asc" | "desc" = "desc"
): Product[] {
  return [...products].sort((a, b) => {
    let comparison = 0;
    if (by === "price") comparison = a.price - b.price;
    else if (by === "date")
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    else if (by === "title") comparison = a.title.localeCompare(b.title);
    return order === "asc" ? comparison : -comparison;
  });
}
