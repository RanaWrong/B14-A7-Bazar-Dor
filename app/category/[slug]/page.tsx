"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { Product, Category, SortOption } from "@/types";
import { getProducts, getCategories } from "@/lib/api";
import { toBengaliNumber, sortProducts } from "@/lib/bengali";

const KNOWN_CATEGORIES: Record<string, { nameBn: string; icon: string }> = {
  chal: { nameBn: "চাল", icon: "🍚" },
  dal: { nameBn: "ডাল", icon: "🫘" },
  tel: { nameBn: "তেল", icon: "🛢️" },
  sobji: { nameBn: "সবজি", icon: "🥬" },
  mach: { nameBn: "মাছ", icon: "🐟" },
  mangsho: { nameBn: "মাংস", icon: "🍗" },
  "dim-dui": { nameBn: "ডিম-দুধ", icon: "🥛" },
  mosla: { nameBn: "মসলা", icon: "🌶️" },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<{ nameBn: string; icon: string } | null>(
    KNOWN_CATEGORIES[slug] || null
  );
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    Promise.all([getProducts(slug), getCategories()])
      .then(([allProducts, categories]) => {
        // Find matching products
        const filtered = (allProducts || []).filter(
          (p) => p.category?.toLowerCase() === slug.toLowerCase()
        );
        setProducts(filtered);

        // Find category info
        const foundCategory = (categories || []).find(
          (c: Category) => c.slug?.toLowerCase() === slug.toLowerCase() || c.id?.toLowerCase() === slug.toLowerCase()
        );

        if (foundCategory) {
          setCategoryInfo({
            nameBn: foundCategory.nameBn,
            icon: foundCategory.icon,
          });
        } else if (KNOWN_CATEGORIES[slug]) {
          setCategoryInfo(KNOWN_CATEGORIES[slug]);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortOption);
  }, [products, sortOption]);

  // Invalid or Empty Category State
  if (!loading && (!categoryInfo || products.length === 0)) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center max-w-lg shadow-sm space-y-4">
          <div className="text-5xl">📦</div>
          <h1 className="text-2xl font-bold text-gray-900">
            {categoryInfo ? `${categoryInfo.nameBn} বিভাগে কোনো পণ্য নেই` : "ক্যাটাগরি পাওয়া যায়নি"}
          </h1>
          <p className="text-sm text-gray-500">
            অনুগ্রহ করে অন্য কোনো ক্যাটাগরি দেখুন অথবা প্রধান পেজে ফিরে যান।
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#00875a] hover:bg-[#00734c] text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <span>← হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Category Header Card (Matches Catagory.png) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex items-center gap-4 sm:gap-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
          {categoryInfo?.icon || "🛒"}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {categoryInfo?.nameBn || slug}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {toBengaliNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      {/* 2. Sort Control Strip (Challenge C1 - Matches Catagory.png) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-end">
        <div className="flex items-center gap-2">
          <label htmlFor="sortCategory" className="text-xs sm:text-sm text-gray-600 font-medium">
            সাজান
          </label>
          <div className="relative">
            <select
              id="sortCategory"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-xl px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* 3. Product Count Subtitle */}
      <div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          মোট {toBengaliNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>
      </div>

      {/* 4. Products Grid */}
      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
