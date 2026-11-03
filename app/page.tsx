"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { Product, SortOption } from "@/types";
import { getProducts, getTopRisers, getTopFallers } from "@/lib/api";
import { getBengaliDate, toBengaliNumber, sortProducts } from "@/lib/bengali";

const FILTER_CATEGORIES = [
  { id: "all", nameBn: "সব", icon: "🛒" },
  { id: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", nameBn: "তেল", icon: "🛢️" },
  { id: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const risers = useMemo(() => getTopRisers(products, 6), [products]);
  const fallers = useMemo(() => getTopFallers(products, 6), [products]);

  // Filtered & sorted products for Section C
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(q) ||
          p.categoryNameBn?.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    return sortProducts(result, sortOption);
  }, [products, selectedCategory, searchQuery, sortOption]);

  const scrollToAllProducts = () => {
    const el = document.getElementById("সব-পণ্য");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#fcfcfb] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-12 sm:space-y-16">
        {/* 1. Hero / Banner Section */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
                <span>📅</span>
                <span>{getBengaliDate()}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                আজকের বাজারের দাম এক নজরে
              </h1>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToAllProducts}
                  className="bg-[#00875a] hover:bg-[#00734c] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                >
                  <span>সব পণ্য দেখুন</span>
                  <span>↓</span>
                </button>
                <a
                  href="#বাজার-পরিসংখ্যান"
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <span>⚖️ বাজার তুলনা</span>
                </a>
              </div>
            </div>

            {/* Right Illustration / Stats Card */}
            <div className="w-full lg:w-auto flex-shrink-0 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4">
              <div className="relative w-64 h-52 sm:w-72 sm:h-60 flex items-center justify-center">
                <Image
                  src="/images/bazar-hero.png"
                  alt="বাজার দর বাস্কেট"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Quick Snapshot Metrics */}
              <div id="বাজার-পরিসংখ্যান" className="grid grid-cols-3 gap-2 w-full max-w-sm bg-gray-50/80 p-3 rounded-2xl border border-gray-100 text-center">
                <div className="p-1">
                  <div className="text-lg font-bold text-[#00875a]">{toBengaliNumber(33)}</div>
                  <div className="text-[10px] text-gray-500 font-medium">নিত্যদিনের পণ্য</div>
                </div>
                <div className="p-1 border-x border-gray-200/60">
                  <div className="text-lg font-bold text-gray-800">{toBengaliNumber(12)}</div>
                  <div className="text-[10px] text-gray-500 font-medium">বাজার অন্তর্ভুক্ত</div>
                </div>
                <div className="p-1">
                  <div className="text-lg font-bold text-gray-800">{toBengaliNumber(6)}</div>
                  <div className="text-[10px] text-gray-500 font-medium">বিভাগের তথ্য</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Section A: আজ দাম বেড়েছে ▲ */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-sm font-bold">▲</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              আজ দাম বেড়েছে
            </h2>
          </div>

          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {risers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 3. Section B: আজ দাম কমেছে ▼ */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-sm font-bold">▼</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              আজ দাম কমেছে
            </h2>
          </div>

          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Section C: সব পণ্য (#সব-পণ্য) */}
        <section id="সব-পণ্য" className="space-y-5 scroll-mt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                সব পণ্য
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                মোট {toBengaliNumber(filteredProducts.length)}টি পণ্য দেখানো হচ্ছে
              </p>
            </div>

            {/* Sort Dropdown (Challenge C1) */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <label htmlFor="sortSelect" className="text-xs text-gray-500 font-medium">
                সাজান:
              </label>
              <div className="relative">
                <select
                  id="sortSelect"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] cursor-pointer"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="price-asc">দাম: কম থেকে বেশি</option>
                  <option value="price-desc">দাম: বেশি থেকে কম</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পণ্যের নাম লিখুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
              {FILTER_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#00875a] text-white shadow-sm"
                        : "bg-gray-100/70 text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.nameBn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-semibold text-gray-800">কোনো পণ্য পাওয়া যায়নি</h3>
              <p className="text-xs text-gray-500">
                অন্য কোনো ক্যাটাগরি বা নাম দিয়ে আবার চেষ্টা করুন।
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-xs text-[#00875a] font-semibold hover:underline"
              >
                সব ফিল্টার মুছুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
