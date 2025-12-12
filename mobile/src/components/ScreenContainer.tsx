import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View } from "react-native";
import { palette } from "../theme/colors";

type Props = {
  children: ReactNode;
  padded?: boolean;
  scrollable?: boolean;
};

export function ScreenContainer({ children, padded = true, scrollable = true }: Props) {
  const content = (
    <View style={[styles.content, padded && styles.padded]}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
});

