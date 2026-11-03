"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Product } from "@/types";
import { getProductByIdOrSlug } from "@/lib/api";
import { toBengaliNumber, formatUnitShort } from "@/lib/bengali";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const { data: session, isPending: authPending } = authClient.useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Protected route check
  useEffect(() => {
    if (!authPending && !session?.user) {
      toast.error("বিস্তারিত তথ্য দেখতে অনুগ্রহ করে প্রথমে সাইন ইন করুন", {
        id: "auth-required",
        duration: 3000,
      });
      router.push("/signin");
    }
  }, [authPending, session, router]);

  // Fetch product data
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductByIdOrSlug(slug)
      .then((data) => {
        setProduct(data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Compute market price statistics
  const stats = useMemo(() => {
    if (!product || !product.markets || product.markets.length === 0) {
      return {
        min: product?.today || 0,
        max: product?.today || 0,
        avg: product?.today || 0,
      };
    }

    const mins = product.markets.map((m) => m.min);
    const maxs = product.markets.map((m) => m.max);
    const min = Math.min(...mins);
    const max = Math.max(...maxs);

    const totalAvg = product.markets.reduce(
      (sum, m) => sum + (m.min + m.max) / 2,
      0
    );
    const avg = Math.round(totalAvg / product.markets.length);

    return { min, max, avg };
  }, [product]);

  // Price comparison text from yesterday
  const priceDiffText = useMemo(() => {
    if (!product) return "";
    const diff = product.today - product.yesterday;
    if (diff > 0) {
      return `গতকালের তুলনায় আজ দাম বেড়েছে · ${toBengaliNumber(diff)} টাকা`;
    }
    if (diff < 0) {
      return `গতকালের তুলনায় আজ দাম কমেছে · ${toBengaliNumber(Math.abs(diff))} টাকা`;
    }
    return "গতকালের তুলনায় আজ দাম অপরিবর্তিত রয়েছে";
  }, [product]);

  // Render auth checking state
  if (authPending || (!session?.user && !loading)) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#00875a] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">যাচাই করা হচ্ছে...</p>
        </div>
      </main>
    );
  }

  // Loading state
  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-6 bg-gray-100 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-3xl border border-gray-100 p-8 h-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  // Not found state
  if (!product) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center max-w-md shadow-sm space-y-4">
          <div className="text-5xl">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900">পণ্যটি খুঁজে পাওয়া যায়নি</h1>
          <p className="text-sm text-gray-500">
            সম্ভবত লিঙ্কটি সঠিক নয় অথবা পণ্যটি তালিকাভুক্ত নেই।
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#00875a] hover:bg-[#00734c] text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              ← হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const pct = Math.abs(product.change?.pct || 0);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          হোম
        </Link>
        <span>&gt;</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-emerald-700 transition-colors"
        >
          {product.categoryNameBn || product.category}
        </Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">{product.nameBn}</span>
      </nav>

      {/* 2. Top Summary Card (Matches Product Details.png) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left info */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#f2f7f4] border border-[#e1eee6] flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
            {product.categoryIcon || product.image || "🛒"}
          </div>
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.nameBn}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              প্রতি {formatUnitShort(product.unit)} · {product.categoryNameBn || product.category}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              {priceDiffText}
            </p>
          </div>
        </div>

        {/* Right Metric Pill Card */}
        <div className="w-full md:w-auto bg-[#fafaf9] border border-gray-100 rounded-2xl p-4 sm:px-6 sm:py-5 flex flex-col items-center justify-center min-w-[170px] text-center shadow-xs">
          <span className="text-xs text-gray-400 font-medium">আজকের দাম</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 my-0.5 tracking-tight">
            {toBengaliNumber(product.today)}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            টাকা / {formatUnitShort(product.unit)}
          </span>
          <div className="mt-2">
            {isUp && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
                ▲ {toBengaliNumber(pct.toFixed(1))}%
              </span>
            )}
            {isDown && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                ▼ {toBengaliNumber(pct.toFixed(1))}%
              </span>
            )}
            {!isUp && !isDown && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                — {toBengaliNumber("০.০")}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. দামের সারসংক্ষেপ (Price Summary Metric Cards) */}
      <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Min Price */}
          <div className="bg-[#fcfcfb] rounded-2xl border border-gray-100/90 p-4 sm:p-5">
            <span className="text-xs text-gray-500 font-medium">সর্বনিম্ন দাম</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
              {toBengaliNumber(stats.min)} টাকা
            </div>
            <p className="text-[11px] text-gray-400 mt-1">সবচেয়ে কম দামের বাজার</p>
          </div>

          {/* Max Price */}
          <div className="bg-[#fcfcfb] rounded-2xl border border-gray-100/90 p-4 sm:p-5">
            <span className="text-xs text-gray-500 font-medium">সর্বাধিক দাম</span>
            <div className="text-xl sm:text-2xl font-bold text-red-500 mt-1">
              {toBengaliNumber(stats.max)} টাকা
            </div>
            <p className="text-[11px] text-gray-400 mt-1">সবচেয়ে বেশি দামের বাজার</p>
          </div>

          {/* Avg Price */}
          <div className="bg-[#fcfcfb] rounded-2xl border border-gray-100/90 p-4 sm:p-5">
            <span className="text-xs text-gray-500 font-medium">গড় দাম</span>
            <div className="text-xl sm:text-2xl font-bold text-[#00875a] mt-1">
              {toBengaliNumber(stats.avg)} টাকা
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              প্রতি {formatUnitShort(product.unit)}-এর হিসাবে
            </p>
          </div>
        </div>
      </section>

      {/* 4. বাজারভিত্তিক আজকের দাম (Market Breakdown Table) */}
      <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {product.markets && product.markets.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fbfbfa] text-xs font-semibold text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 sm:px-6">বাজার</th>
                  <th className="py-3 px-4 sm:px-6">বিভাগ</th>
                  <th className="py-3 px-4 sm:px-6 text-center">সর্বনিম্ন</th>
                  <th className="py-3 px-4 sm:px-6 text-center">সর্বাধিক</th>
                  <th className="py-3 px-4 sm:px-6 text-right">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {product.markets.map((m, idx) => {
                  const mAvg = Math.round((m.min + m.max) / 2);
                  return (
                    <tr
                      key={`${m.market}-${idx}`}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-gray-900 whitespace-nowrap">
                        {m.market}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-gray-600 whitespace-nowrap">
                        {m.division}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center font-medium text-emerald-600 whitespace-nowrap">
                        {toBengaliNumber(m.min)} টাকা
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center font-medium text-red-500 whitespace-nowrap">
                        {toBengaliNumber(m.max)} টাকা
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-semibold text-gray-900 whitespace-nowrap">
                        {toBengaliNumber(mAvg)} টাকা
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-400">
            এই পণ্যের জন্য আলাদা বাজার তথ্য পাওয়া যায়নি।
          </div>
        )}
      </section>
    </main>
  );
}
