"use client";

export const AFFIRMATION_CATEGORY_OPTIONS: string[] = [
  "Abundance & Prosperity",
  "Confidence & Self-Worth",
  "Courage & Action",
  "Faith & Trust in the Journey",
  "Gratitude & Joy",
  "Growth & Self-Belief",
  "Inner Peace & Calm",
  "Purpose & Motivation",
  "Resilience & Strength",
  "Self-Love & Acceptance",
];

interface AffirmationCategoryButtonsProps {
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

const baseClasses =
  "px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap";

export default function AffirmationCategoryButtons({
  selectedCategory,
  onSelect,
}: AffirmationCategoryButtonsProps) {
  const renderButton = (label: string, value: string | null) => {
    const active =
      value === null ? selectedCategory === null : selectedCategory === value;
    const activeClasses = "bg-purple-600 text-white shadow";
    const idleClasses = "bg-white/80 text-gray-700 hover:bg-white";

    return (
      <button
        key={label}
        type="button"
        onClick={() => onSelect(value)}
        className={`${baseClasses} ${active ? activeClasses : idleClasses}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {renderButton("All", null)}
        {AFFIRMATION_CATEGORY_OPTIONS.map((category) =>
          renderButton(category, category)
        )}
      </div>
    </div>
  );
}
