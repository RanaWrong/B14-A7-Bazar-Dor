"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { getBengaliDate } from "@/lib/bengali";
import { authClient } from "@/lib/auth-client";
import { Category } from "@/types";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // BetterAuth session state
  const { data: session, isPending } = authClient.useSession();

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    }
  };

  const currentDateBn = getBengaliDate();

  return (
    <nav className="w-full bg-white border-b border-gray-100">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Brand Logo & Bangla Date */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-[#00875a] flex items-center justify-center text-white text-2xl shadow-sm transition-transform group-hover:scale-105">
            🛒
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-none">
              বাজার দর
            </span>
            <span className="text-xs text-gray-500 font-medium mt-1">
              {currentDateBn}
            </span>
          </div>
        </Link>

        {/* Right: Auth Buttons or User Avatar Dropdown */}
        <div className="relative" ref={menuRef}>
          {isPending ? (
            <div className="w-24 h-9 bg-gray-100 rounded-lg animate-pulse" />
          ) : session?.user ? (
            <div>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                aria-label="User menu"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center text-sm ring-2 ring-[#00875a]/20 overflow-hidden">
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(session.user.name || "U")[0].toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-800 max-w-[120px] truncate">
                  {session.user.name || "ব্যবহারকারী"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu (Matches 'Home User Menu Open.png') */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {session.user.name || "ব্যবহারকারী"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {session.user.email}
                    </p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>👤</span>
                      <span>আমার প্রোফাইল</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1.5">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <span>←</span>
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/signin"
                className="text-xs sm:text-sm font-medium text-gray-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="text-xs sm:text-sm font-medium bg-[#00875a] hover:bg-[#00734c] text-white px-3.5 sm:px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation Strip */}
      <div className="border-t border-gray-100 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                pathname === "/"
                  ? "bg-[#00875a] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
              }`}
            >
              <span>🛒</span>
              <span>সব</span>
            </Link>

            {DEFAULT_CATEGORIES.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#00875a] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
