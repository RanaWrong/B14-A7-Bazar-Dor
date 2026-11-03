import { Category, Product } from "@/types";

const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchFromBazarApi<T>(endpoint: string): Promise<T> {
  let lastError: Error | null = null;

  for (const baseUrl of BASE_URLS) {
    try {
      const url = `${baseUrl}${endpoint}`;
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json)
          ? json
          : json.data || json.value || json.products || json;
        return data as T;
      }
    } catch (err) {
      lastError = err as Error;
      continue;
    }
  }

  throw lastError || new Error(`Failed to fetch from ${endpoint}`);
}

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const endpoint = category && category !== "all" ? `/products?category=${encodeURIComponent(category)}` : "/products";
    const data = await fetchFromBazarApi<Product[]>(endpoint);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchFromBazarApi<Category[]>("/categories");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

export async function getProductByIdOrSlug(idOrSlug: string | number): Promise<Product | null> {
  const queryStr = idOrSlug.toString().trim();
  const isNumeric = /^\d+$/.test(queryStr);

  if (isNumeric) {
    try {
      const product = await fetchFromBazarApi<Product>(`/products/${queryStr}`);
      if (product && product.id) {
        return product;
      }
    } catch (e) {
      // Fall through to list lookup
    }
  }

  const allProducts = await getProducts();
  const found = allProducts.find(
    (p) => p.slug === queryStr || p.id.toString() === queryStr
  );

  return found || null;
}

export function getTopRisers(products: Product[], limit = 6): Product[] {
  return [...products]
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, limit);
}

export function getTopFallers(products: Product[], limit = 6): Product[] {
  return [...products]
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, limit);
}
