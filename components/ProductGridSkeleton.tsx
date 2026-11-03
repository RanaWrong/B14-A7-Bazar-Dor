export default function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between animate-pulse"
        >
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
          <div className="flex items-end justify-between pt-3 border-t border-gray-50">
            <div className="space-y-1">
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="h-5 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-6 bg-gray-100 rounded-full w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}
