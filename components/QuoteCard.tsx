import { Quote, getCategoryName } from "@/lib/types";

interface QuoteCardProps {
  quote: Quote;
}

// Beautiful gradient combinations using the provided color palette
// Primary: indigo-50, indigo-100, indigo-600, indigo-700, indigo-900
// Accent: purple-50, purple-100, purple-400, purple-500 (using lighter purples)
// Accent: pink-50, pink-400, pink-500, pink-600, rose-500
const gradientCombinations = [
  "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50",
  "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-50",
  "bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-400",
  "bg-gradient-to-br from-indigo-100 via-purple-400 to-pink-400",
  "bg-gradient-to-br from-indigo-50 via-purple-400 to-pink-500",
  "bg-gradient-to-br from-purple-50 via-indigo-100 to-pink-50",
  "bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-400",
  "bg-gradient-to-br from-purple-400 via-indigo-100 to-pink-500",
  "bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50",
  "bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50",
  "bg-gradient-to-br from-pink-50 via-purple-100 to-indigo-100",
  "bg-gradient-to-br from-pink-400 via-purple-50 to-indigo-50",
  "bg-gradient-to-br from-pink-400 via-purple-100 to-indigo-100",
  "bg-gradient-to-br from-pink-500 via-purple-400 to-indigo-100",
  "bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50",
];

function getGradient(quoteid: number): string {
  return gradientCombinations[quoteid % gradientCombinations.length];
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const gradient = getGradient(quote.quoteid);

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-white/20 ${gradient}`}>
      <div className="relative p-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/30 text-gray-800 backdrop-blur-sm shadow-sm">
            {quote.qcategory?.trim() || getCategoryName(quote.categoryid)}
          </span>
        </div>
        <p className="text-lg leading-relaxed mb-4 text-gray-800 font-medium">
          &ldquo;{quote.quotetext}&rdquo;
        </p>
        {quote.author && (
          <p className="text-sm font-medium italic text-gray-700">
            — {quote.author}
          </p>
        )}
      </div>
    </div>
  );
}

