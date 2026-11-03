"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { toBengaliNumber, formatUnitShort } from "@/lib/bengali";
import { getProducts } from "@/lib/api";

interface PriceTickerProps {
  initialProducts?: Product[];
}

export default function PriceTicker({ initialProducts }: PriceTickerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      getProducts().then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      });
    }
  }, [initialProducts]);

  if (!products || products.length === 0) {
    return (
      <div className="w-full bg-[#fbfbfa] border-y border-gray-100 py-2.5 overflow-hidden text-xs text-gray-400 text-center">
        বাজার দর লোড হচ্ছে...
      </div>
    );
  }

  // Duplicate list to achieve continuous infinite marquee loop
  const displayItems = [...products, ...products];

  return (
    <div className="w-full bg-[#fbfbfa] border-y border-gray-100/90 py-2 overflow-hidden select-none">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-6">
        {displayItems.map((item, idx) => {
          const isUp = item.change?.dir === "up";
          const isDown = item.change?.dir === "down";
          const pct = Math.abs(item.change?.pct || 0);

          return (
            <Link
              key={`${item.id}-${idx}`}
              href={`/product/${item.slug || item.id}`}
              className="inline-flex items-center gap-2 text-xs text-gray-700 hover:text-emerald-700 transition-colors whitespace-nowrap px-1"
            >
              <span className="text-sm">{item.categoryIcon || item.image || "🛒"}</span>
              <span className="font-medium text-gray-800">{item.nameBn}</span>
              <span className="text-gray-500">
                {toBengaliNumber(item.today)} টাকা/{formatUnitShort(item.unit)}
              </span>
              {isUp && (
                <span className="inline-flex items-center text-[11px] font-semibold text-red-500">
                  ▲ {toBengaliNumber(pct.toFixed(1))}%
                </span>
              )}
              {isDown && (
                <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600">
                  ▼ {toBengaliNumber(pct.toFixed(1))}%
                </span>
              )}
              {!isUp && !isDown && (
                <span className="inline-flex items-center text-[11px] text-gray-400">
                  — {toBengaliNumber("০.০")}%
                </span>
              )}
              <span className="text-gray-300 ml-3">|</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
