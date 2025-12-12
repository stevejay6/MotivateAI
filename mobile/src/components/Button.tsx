import { ReactNode } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { palette } from "../theme/colors";
import { Text } from "./Text";

type Variant = "primary" | "outline" | "ghost";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
};

export function Button({ children, onPress, disabled = false, variant = "primary", style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variants[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "outline" || variant === "ghost" ? styles.primaryLabel : styles.lightLabel,
          disabled && styles.mutedLabel,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "600",
    fontSize: 15,
  },
  primaryLabel: {
    color: palette.primary,
  },
  lightLabel: {
    color: "#fff",
  },
  mutedLabel: {
    color: palette.muted,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
});

const variants: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: palette.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: palette.primary,
    backgroundColor: "transparent",
  },
  ghost: {
    backgroundColor: "transparent",
  },
};

