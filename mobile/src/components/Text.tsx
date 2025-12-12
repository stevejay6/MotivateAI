import { ReactNode } from "react";
import { Text as RNText, StyleSheet, TextProps } from "react-native";
import { palette } from "../theme/colors";

type Variant = "title" | "subtitle" | "body" | "caption";

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
  children: ReactNode;
};

export function Text({ variant = "body", muted = false, style, children, ...rest }: Props) {
  return (
    <RNText
      style={[styles.base, variantStyles[variant], muted && styles.muted, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: palette.text,
  },
  muted: {
    color: palette.muted,
  },
});

const variantStyles: Record<Variant, any> = {
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
  },
  caption: {
    fontSize: 13,
    fontWeight: "400",
    color: palette.muted,
  },
};

