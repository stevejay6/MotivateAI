import { ScrollView, StyleSheet, View } from "react-native";
import { palette } from "../theme/colors";
import { Text } from "./Text";
import { Pressable } from "react-native";

type Props = {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
};

export function CategoryChips({ options, value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      <Chip label="All" active={value === null} onPress={() => onChange(null)} />
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          active={value === option}
          onPress={() => onChange(option)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
      hitSlop={8}
    >
      <Text style={active ? styles.chipActiveText : styles.chipIdleText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginVertical: 10,
  },
  container: {
    gap: 10,
    paddingHorizontal: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  chipIdle: {
    backgroundColor: "#fff",
    borderColor: palette.border,
  },
  chipActiveText: {
    color: "#fff",
    fontWeight: "600",
  },
  chipIdleText: {
    color: palette.text,
    fontWeight: "600",
  },
});

