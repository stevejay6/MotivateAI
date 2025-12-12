import { ActivityIndicator, StyleSheet, View } from "react-native";
import { palette } from "../theme/colors";
import { Text } from "./Text";

type Props = {
  label?: string;
};

export function Loading({ label = "Loading..." }: Props) {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator color={palette.primary} />
      <Text variant="caption" muted style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    textAlign: "center",
  },
});

