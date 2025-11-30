"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import AffirmationCategoryButtons from "@/components/AffirmationCategoryButtons";
import AffirmationCard from "@/components/AffirmationCard";
import { getYouAffirmationsPaginated } from "@/lib/supabase";
import { YouAffirmation } from "@/lib/types";

export default function YouAffirmationsPage() {
  const [affirmations, setAffirmations] = useState<YouAffirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [randomSeed, setRandomSeed] = useState<number>(() => Date.now());

  const handleCategorySelect = useCallback((category: string | null) => {
    const nextSeed = Date.now() + Math.floor(Math.random() * 1000);
    setRandomSeed(nextSeed);
    setSelectedCategory(category);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadAffirmations() {
      try {
        const useRandom = true;
        const response = await getYouAffirmationsPaginated(
          25,
          0,
          searchQuery || undefined,
          selectedCategory,
          useRandom,
          useRandom ? randomSeed : undefined
        );
        if (!isCancelled) {
          setAffirmations(response.affirmations);
        }
      } catch (error) {
        console.error("Error fetching you-affirmations:", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadAffirmations();
    return () => {
      isCancelled = true;
    };
  }, [searchQuery, selectedCategory, randomSeed]);

  const hasFilters = Boolean(searchQuery) || selectedCategory !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading affirmations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">You - Affirmations</h1>
          <p className="text-gray-600">
            Uplifting words curated for every part of your journey.
          </p>
          <p className="text-sm text-gray-500">
            Looking for more inspiration?{" "}
            <Link
              href="/quotes"
              className="text-purple-600 font-semibold hover:text-purple-700 underline"
            >
              Visit Quotes Discovery
            </Link>{" "}
            or{" "}
            <Link
              href="/iaffirmations"
              className="text-purple-600 font-semibold hover:text-purple-700 underline"
            >
              explore I - Affirmations
            </Link>
            .
          </p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search affirmations..."
        />

        <AffirmationCategoryButtons
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />

        <div className="space-y-6">
          {affirmations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {hasFilters
                  ? "No affirmations found. Try another category or search."
                  : "No affirmations available yet."}
              </p>
            </div>
          ) : (
            affirmations.map((affirmation) => (
              <AffirmationCard
                key={affirmation.uaffid}
                affirmation={{
                  ...affirmation,
                  iaffid: 0,
                  icategoryid: 0,
                }}
                categoryLabel={affirmation.ucategoryname || affirmation.ucategory}
              />
            ))
          )}
        </div>

        {affirmations.length > 0 && (
          <div className="mt-8">
            <AffirmationCategoryButtons
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
            <p className="text-center text-gray-500 text-sm mt-4">
              Looking for a different energy? Pick another category above or
              below.
            </p>
            <p className="text-center text-sm text-purple-600 mt-2">
              Prefer quotes?{" "}
              <Link
                href="/quotes"
                className="font-semibold underline hover:text-purple-700"
              >
                Jump to Quotes Discovery
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


