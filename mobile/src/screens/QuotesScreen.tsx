import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ScreenContainer } from "../components/ScreenContainer";
import { Text } from "../components/Text";
import { SearchInput } from "../components/SearchInput";
import { CategoryChips } from "../components/CategoryChips";
import { QuoteCard } from "../components/QuoteCard";
import { fetchQuotes } from "../lib/data";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";

const QCATEGORY_OPTIONS = [
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

export function QuotesScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["quotes", search, category],
    queryFn: () => fetchQuotes({ search, qcategory: category }),
  });

  const quotes = data ?? [];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="title">Quotes Discovery</Text>
        <Text muted>Find inspiration by topic or search.</Text>
      </View>

      <SearchInput value={search} onChange={setSearch} placeholder="Search quotes or authors" />
      <CategoryChips options={QCATEGORY_OPTIONS} value={category} onChange={setCategory} />

      {isLoading || isRefetching ? (
        <Loading label="Loading quotes..." />
      ) : quotes.length === 0 ? (
        <EmptyState title="No quotes found" subtitle="Try another topic or clear filters." />
      ) : (
        <View style={styles.list}>
          {quotes.map((quote) => (
            <QuoteCard key={quote.quoteid} quote={quote} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 14,
  },
  list: {
    marginTop: 10,
    gap: 12,
    paddingBottom: 40,
  },
});

