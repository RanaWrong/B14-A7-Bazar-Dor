"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    } else if (!isPending) {
      toast.error("প্রোফাইল দেখতে অনুগ্রহ করে সাইন ইন করুন");
      router.push("/signin");
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("অনুগ্রহ করে একটি নাম লিখুন");
      return;
    }

    setUpdating(true);
    try {
      const res = await authClient.updateUser({
        name: name.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || "তথ্য আপডেট করা যায়নি");
      } else {
        toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err?.message || "তথ্য আপডেটে ত্রুটি হয়েছে");
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  if (isPending) {
    return (
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#00875a] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      {/* 1. User Summary Card (Matches Profile.png) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0 overflow-hidden ring-2 ring-[#00875a]/20">
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
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {session.user.name || "ব্যবহারকারী"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {session.user.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="border border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>←</span>
          <span>সাইন আউট</span>
        </button>
      </div>

      {/* 2. তথ্য / Information Form Card (Challenge C3 - Matches Profile.png) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">তথ্য</h2>
          <Link
            href="/profile/update"
            className="text-xs text-[#00875a] font-semibold hover:underline"
          >
            আলাদা পেজে আপডেট করুন →
          </Link>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700 mb-1.5">
              নাম
            </label>
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ইমেইল (পরিবর্তনযোগ্য নয়)
            </label>
            <input
              type="email"
              value={session.user.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updating}
              className="w-full sm:w-auto min-w-[120px] bg-[#00875a] hover:bg-[#00734c] text-white text-sm font-semibold px-8 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
