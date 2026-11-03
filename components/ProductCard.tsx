"use client";

import Link from "next/link";
import { Product } from "@/types";
import { toBengaliNumber, formatBengaliUnit } from "@/lib/bengali";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const pct = Math.abs(product.change?.pct || 0);

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group bg-white rounded-2xl border border-gray-100/90 hover:border-emerald-200 p-4 sm:p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between relative"
    >
      {/* Top Part: Icon, Title & Unit */}
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-50/90 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
          {product.categoryIcon || product.image || "🛒"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base sm:text-[17px] truncate group-hover:text-emerald-700 transition-colors">
            {product.nameBn}
          </h3>
          <p className="text-xs text-gray-400 font-normal mt-0.5">
            {formatBengaliUnit(product.unit)}
          </p>
        </div>
      </div>

      {/* Bottom Part: Price & Change badge */}
      <div className="flex items-end justify-between pt-2 border-t border-gray-50">
        <div>
          <span className="block text-[11px] text-gray-400 font-medium">আজকের দাম</span>
          <span className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
            {toBengaliNumber(product.today)} <span className="text-xs sm:text-sm font-medium text-gray-600">টাকা</span>
          </span>
        </div>

        <div className="flex-shrink-0">
          {isUp && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100/60">
              ▲ {toBengaliNumber(pct.toFixed(1))}%
            </span>
          )}
          {isDown && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/60">
              ▼ {toBengaliNumber(pct.toFixed(1))}%
            </span>
          )}
          {!isUp && !isDown && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
              — {toBengaliNumber("০.০")}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
