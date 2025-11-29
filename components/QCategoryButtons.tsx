"use client";

interface QCategoryButtonsProps {
  selectedQCategory: string | null;
  onSelect: (qcategory: string | null) => void;
}

export const QCATEGORY_OPTIONS: string[] = [
  "Personal Growth & Mindset",
  "Emotional Wellness",
  "Self-Love & Identity",
  "Relationships",
  "Positivity & Gratitude",
  "Wisdom & Reflection",
  "Inspiration & Creativity",
  "Challenge & Growth",
  "Encouragement",
];

const baseButtonClasses =
  "px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap";

export default function QCategoryButtons({
  selectedQCategory,
  onSelect,
}: QCategoryButtonsProps) {
  const renderButton = (label: string, value: string | null) => {
    const isActive =
      (value === null && selectedQCategory === null) ||
      (value !== null && selectedQCategory === value);

    const activeClasses = "bg-purple-600 text-white shadow-md";
    const idleClasses = "bg-white/70 text-gray-700 hover:bg-white";

    return (
      <button
        key={label}
        type="button"
        onClick={() => onSelect(value)}
        className={`${baseButtonClasses} ${isActive ? activeClasses : idleClasses}`}
        aria-pressed={isActive}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {renderButton("All", null)}
        {QCATEGORY_OPTIONS.map((label) => renderButton(label, label))}
      </div>
    </div>
  );
}


