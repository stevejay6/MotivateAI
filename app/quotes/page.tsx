"use client";

import { useState, useEffect, useCallback } from "react";
import { Quote, categoryIdToName } from "@/lib/types";
import QuoteCard from "@/components/QuoteCard";
import CategoryChips from "@/components/CategoryChips";
import SearchBar from "@/components/SearchBar";
import { getQuotesPaginated, getCategories } from "@/lib/supabase";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [availableCategoryIds, setAvailableCategoryIds] = useState<number[]>(
    []
  );
  const [randomSeed, setRandomSeed] = useState<number>(() => Date.now());

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        // Populate categoryIdToName mapping
        data.forEach((cat) => {
          categoryIdToName[cat.categoryid] = cat.categoryname;
        });
        // Get unique category IDs from categories that have quotes
        const categoryIds = data.map((cat) => cat.categoryid);
        setAvailableCategoryIds(categoryIds);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch quotes function
  const fetchQuotes = useCallback(
    async (reset: boolean = false, currentOffset?: number) => {
      const offsetToUse = reset ? 0 : currentOffset ?? offset;
      const isInitialLoad = reset;

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        // Use random ordering when "All" is selected (selectedCategoryId is null)
        const useRandom = selectedCategoryId === null;
        const response = await getQuotesPaginated(
          25,
          offsetToUse,
          searchQuery || undefined,
          selectedCategoryId,
          useRandom,
          useRandom ? randomSeed : undefined
        );

        if (reset) {
          setQuotes(response.quotes);
          setOffset(response.quotes.length);
        } else {
          setQuotes((prev) => [...prev, ...response.quotes]);
          setOffset((prev) => prev + response.quotes.length);
        }

        setHasMore(response.hasMore);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, selectedCategoryId, offset, randomSeed]
  );

  // Handle category selection, generating a new random seed whenever "All" is chosen
  const handleCategorySelect = useCallback(
    (categoryId: number | null) => {
      if (categoryId === null) {
        const nextSeed = Date.now() + Math.floor(Math.random() * 1000);
        setRandomSeed(nextSeed);
      }
      setSelectedCategoryId(categoryId);
    },
    []
  );

  // Initial load and when filters change
  useEffect(() => {
    async function loadQuotes() {
      setOffset(0);
      const offsetToUse = 0;
      const isInitialLoad = true;

      setLoading(true);

      try {
        // Use random ordering when "All" is selected (selectedCategoryId is null)
        const useRandom = selectedCategoryId === null;
        const response = await getQuotesPaginated(
          25,
          offsetToUse,
          searchQuery || undefined,
          selectedCategoryId,
          useRandom,
          useRandom ? randomSeed : undefined
        );

        setQuotes(response.quotes);
        setOffset(response.quotes.length);
        setHasMore(response.hasMore);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadQuotes();
  }, [searchQuery, selectedCategoryId, randomSeed]);

  const handleLoadMore = useCallback(() => {
    fetchQuotes(false, offset);
  }, [fetchQuotes, offset]);

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
        </div>

        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <CategoryChips
          availableCategoryIds={availableCategoryIds}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
          categoryIdToName={categoryIdToName}
        />

        <div className="space-y-6">
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery || selectedCategoryId
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

        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading...
                </span>
              ) : (
                "Load More Quotes"
              )}
            </button>
          </div>
        )}

        {quotes.length > 0 && !hasMore && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing all {quotes.length} quotes
          </div>
        )}
      </div>
    </div>
  );
}

