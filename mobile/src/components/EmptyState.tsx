import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { palette } from "../theme/colors";

type Props = {
  title: string;
  subtitle?: string;
};

export function EmptyState({ title, subtitle }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text variant="subtitle">{title}</Text>
      {subtitle ? (
        <Text variant="caption" muted style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: palette.border,
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 6,
  },
  subtitle: {
    textAlign: "center",
  },
});

