import { Affirmation } from "@/lib/types";

interface AffirmationCardProps {
  affirmation: Affirmation;
  categoryLabel?: string | null;
}

const gradientClasses =
  "bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50";

export default function AffirmationCard({
  affirmation,
  categoryLabel,
}: AffirmationCardProps) {
  const chipLabel =
    categoryLabel?.trim() ||
    affirmation.icategory?.trim() ||
    affirmation.icategoryname?.trim() ||
    (affirmation.icategoryid
      ? `Category ${affirmation.icategoryid}`
      : "Affirmation");

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-white/40 ${gradientClasses}`}
    >
      <div className="relative p-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/50 text-gray-800 backdrop-blur-sm shadow-sm">
            {chipLabel}
          </span>
        </div>
        <p className="text-lg leading-relaxed text-gray-800 font-medium">
          &ldquo;{affirmation.quotetext}&rdquo;
        </p>
      </div>
    </div>
  );
}


