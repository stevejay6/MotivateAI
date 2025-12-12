import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ScreenContainer } from "../components/ScreenContainer";
import { Text } from "../components/Text";
import { SearchInput } from "../components/SearchInput";
import { CategoryChips } from "../components/CategoryChips";
import { AffirmationCard } from "../components/AffirmationCard";
import { fetchAffirmations } from "../lib/data";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";

const AFFIRMATION_CATEGORY_OPTIONS = [
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

export function AffirmationsScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ["affirmations", search, category],
    queryFn: () => fetchAffirmations({ search, category }),
  });

  const affirmations = data ?? [];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="title">I - Affirmations</Text>
        <Text muted>Curated prompts for any moment.</Text>
      </View>

      <SearchInput value={search} onChange={setSearch} placeholder="Search affirmations" />
      <CategoryChips options={AFFIRMATION_CATEGORY_OPTIONS} value={category} onChange={setCategory} />

      {isLoading || isRefetching ? (
        <Loading label="Loading affirmations..." />
      ) : affirmations.length === 0 ? (
        <EmptyState title="No affirmations found" subtitle="Try another category or search." />
      ) : (
        <View style={styles.list}>
          {affirmations.map((affirmation) => (
            <AffirmationCard key={affirmation.iaffid ?? affirmation.quotetext} affirmation={affirmation} />
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

