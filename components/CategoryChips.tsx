"use client";

interface CategoryChipsProps {
  availableCategoryIds: number[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  categoryIdToName: Record<number, string>;
}

const categoryColors: Record<number, string> = {
  // Default colors - user can customize based on their categoryid values
  1: "bg-green-100 text-green-800 hover:bg-green-200",
  2: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  3: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  4: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  5: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  6: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  7: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  8: "bg-red-100 text-red-800 hover:bg-red-200",
};

const activeCategoryColors: Record<number, string> = {
  1: "bg-green-500 text-white hover:bg-green-600",
  2: "bg-blue-500 text-white hover:bg-blue-600",
  3: "bg-pink-500 text-white hover:bg-pink-600",
  4: "bg-purple-500 text-white hover:bg-purple-600",
  5: "bg-yellow-500 text-white hover:bg-yellow-600",
  6: "bg-indigo-500 text-white hover:bg-indigo-600",
  7: "bg-orange-500 text-white hover:bg-orange-600",
  8: "bg-red-500 text-white hover:bg-red-600",
};

export default function CategoryChips({
  availableCategoryIds,
  selectedCategoryId,
  onCategorySelect,
  categoryIdToName,
}: CategoryChipsProps) {
  // Get unique category IDs and sort them
  const sortedCategoryIds = [...new Set(availableCategoryIds)].sort(
    (a, b) => a - b
  );

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          selectedCategoryId === null
            ? "bg-gray-800 text-white hover:bg-gray-900"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {sortedCategoryIds.map((categoryId) => {
        const isActive = selectedCategoryId === categoryId;
        const baseColor = isActive
          ? activeCategoryColors[categoryId] || "bg-gray-500 text-white hover:bg-gray-600"
          : categoryColors[categoryId] || "bg-gray-100 text-gray-700 hover:bg-gray-200";
        const categoryName =
          categoryIdToName[categoryId] || `Category ${categoryId}`;
        return (
          <button
            key={categoryId}
            onClick={() => onCategorySelect(categoryId)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${baseColor}`}
          >
            {categoryName}
          </button>
        );
      })}
    </div>
  );
}

