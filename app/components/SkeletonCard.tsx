// components/tours/SkeletonCard.tsx
export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="h-64 bg-gray-300 dark:bg-gray-700" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20" />
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20" />
      </div>
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-xl w-full" />
    </div>
  </div>
);