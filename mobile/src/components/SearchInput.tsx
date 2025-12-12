import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Search, X } from "lucide-react-native";
import { palette } from "../theme/colors";
import { Pressable } from "react-native";

type Props = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, placeholder = "Search...", onChange }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, focused && styles.focused]}>
      <Search size={18} color={palette.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        style={styles.input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChange("")} hitSlop={8}>
          <X size={16} color={palette.muted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#fff",
  },
  focused: {
    borderColor: palette.primary,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: palette.text,
  },
});

