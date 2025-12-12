import { StyleSheet, View } from "react-native";
import { palette } from "../theme/colors";
import { Text } from "./Text";
import { Card } from "./Card";

export type Affirmation = {
  iaffid?: number;
  quotetext: string;
  icategoryname?: string | null;
  icategory?: string | null;
};

type Props = {
  affirmation: Affirmation;
};

export function AffirmationCard({ affirmation }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.badge}>
        <Text variant="caption" style={styles.badgeText}>
          {affirmation.icategoryname || affirmation.icategory || "Affirmation"}
        </Text>
      </View>
      <Text style={styles.text}>{affirmation.quotetext}</Text>
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
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#ECFEFF",
  },
  badgeText: {
    color: palette.primary,
    fontWeight: "600",
  },
});

