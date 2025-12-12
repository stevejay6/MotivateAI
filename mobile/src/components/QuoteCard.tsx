import { StyleSheet, View } from "react-native";
import { palette } from "../theme/colors";
import { Text } from "./Text";
import { Card } from "./Card";

export type Quote = {
  quoteid: number;
  quotetext: string;
  author: string | null;
  qcategory?: string | null;
};

type Props = {
  quote: Quote;
};

export function QuoteCard({ quote }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.badge}>
        <Text variant="caption" style={styles.badgeText}>
          {quote.qcategory || "Inspiration"}
        </Text>
      </View>
      <Text style={styles.text}>{quote.quotetext}</Text>
      {quote.author ? (
        <Text variant="caption" muted style={styles.author}>
          — {quote.author}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: palette.text,
  },
  author: {
    textAlign: "right",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
  },
  badgeText: {
    color: palette.primary,
    fontWeight: "600",
  },
});

