import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-14 text-center max-w-lg shadow-sm space-y-5">
        <div className="text-6xl sm:text-7xl">🛒🔍</div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
            ৪০৪ - পাতা পাওয়া যায়নি
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            পৃষ্ঠাটি খুঁজে পাওয়া যাচ্ছে না
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            আপনি যে ঠিকানাটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ঠিকানাটি ভুল হতে পারে।
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#00875a] hover:bg-[#00734c] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <span>← হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
