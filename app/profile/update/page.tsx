"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfileUpdatePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    } else if (!isPending) {
      toast.error("প্রোফাইল আপডেট করতে সাইন ইন প্রয়োজন");
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
        router.push("/profile");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err?.message || "তথ্য আপডেটে ত্রুটি হয়েছে");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex-1 max-w-xl mx-auto px-4 py-16 flex items-center justify-center">
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
    <main className="flex-1 max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/profile"
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← প্রোফাইলে ফিরে যান
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">তথ্য আপডেট করুন</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            আপনার অ্যাকাউন্টের নাম পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন।
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="updateNameInput" className="block text-sm font-medium text-gray-700 mb-1.5">
              নাম
            </label>
            <input
              id="updateNameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a] transition-colors"
              required
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={updating}
              className="bg-[#00875a] hover:bg-[#00734c] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {updating ? "আপডেট হচ্ছে..." : "Update Information"}
            </button>
            <Link
              href="/profile"
              className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
