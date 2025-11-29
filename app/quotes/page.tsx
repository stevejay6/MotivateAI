"use client";

import { useState, useEffect, useCallback } from "react";
import { Quote } from "@/lib/types";
import QuoteCard from "@/components/QuoteCard";
import QCategoryButtons from "@/components/QCategoryButtons";
import SearchBar from "@/components/SearchBar";
import { getQuotesPaginated } from "@/lib/supabase";
import Link from "next/link";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQCategory, setSelectedQCategory] = useState<string | null>(null);
  const [randomSeed, setRandomSeed] = useState<number>(() => Date.now());

  // Handle category selection, generating a new random seed whenever "All" is chosen
  const handleQCategorySelect = useCallback(
    (qcategory: string | null) => {
      if (qcategory === null) {
        const nextSeed = Date.now() + Math.floor(Math.random() * 1000);
        setRandomSeed(nextSeed);
      }
      setSelectedQCategory(qcategory);
    },
    []
  );

  // Initial load and when filters change
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadQuotes() {
      try {
        // Use random ordering when "All" is selected (selectedQCategory is null)
        const useRandom = selectedQCategory === null;
        const response = await getQuotesPaginated(
          25,
          0,
          searchQuery || undefined,
          null,
          selectedQCategory,
          useRandom,
          useRandom ? randomSeed : undefined
        );

        if (!isCancelled) {
          setQuotes(response.quotes);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadQuotes();
    return () => {
      isCancelled = true;
    };
  }, [searchQuery, selectedQCategory, randomSeed]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Quotes Discovery
          </h1>
          <p className="text-gray-600">Find inspiration in every word</p>
          <p className="text-sm text-gray-500 mt-3">
            Want daily affirmations?{" "}
            <Link
              href="/iaffirmations"
              className="text-purple-600 font-semibold hover:text-purple-700 underline"
            >
              Visit I - Affirmations
            </Link>
          </p>
        </div>

        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <QCategoryButtons
          selectedQCategory={selectedQCategory}
          onSelect={handleQCategorySelect}
        />

        <div className="space-y-6">
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery || selectedQCategory
                  ? "No quotes found matching your criteria."
                  : "No quotes available. Add some quotes to your Supabase database."}
              </p>
            </div>
          ) : (
            quotes.map((quote) => (
              <QuoteCard key={quote.quoteid} quote={quote} />
            ))
          )}
        </div>

        {quotes.length > 0 && (
          <div className="mt-8">
            <QCategoryButtons
              selectedQCategory={selectedQCategory}
              onSelect={handleQCategorySelect}
            />
            <p className="text-center text-gray-500 text-sm mt-4">
              Want something different? Pick another topic above or below.
            </p>
            <p className="text-center text-sm text-purple-600 mt-2">
              Ready for more mindful mantras?{" "}
              <Link
                href="/iaffirmations"
                className="font-semibold underline hover:text-purple-700"
              >
                Open I - Affirmations
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

