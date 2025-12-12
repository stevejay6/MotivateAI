import { StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { ScreenContainer } from "../components/ScreenContainer";
import { palette } from "../theme/colors";
import { Heart, Quote, Brain, Notebook, Zap, Rocket } from "lucide-react-native";

const tiles = [
  { label: "Quotes", route: "Quotes", icon: Quote, color: "#7C3AED" },
  { label: "I - Affirmations", route: "Affirmations", icon: Heart, color: "#EC4899" },
  { label: "Emotional Coach", route: "Coach", icon: Brain, color: "#22C55E" },
  { label: "AI Journal", route: "Journal", icon: Notebook, color: "#2563EB" },
  { label: "Motivate Me Now", route: "Motivate", icon: Zap, color: "#F59E0B" },
  { label: "Kick in the Pants", route: "Kick", icon: Rocket, color: "#14B8A6" },
];

export function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="title">Mindful Moments</Text>
        <Text muted>Mobile-first experience for quotes, affirmations, and AI support.</Text>
      </View>
      <View style={styles.grid}>
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Pressable
              key={tile.route}
              onPress={() => navigation.navigate(tile.route as never)}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              <Card padded style={styles.card}>
                <View style={[styles.iconWrap, { backgroundColor: tile.color + "20" }]}>
                  <Icon size={22} color={tile.color} />
                </View>
                <Text variant="subtitle">{tile.label}</Text>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tile: {
    width: "48%",
  },
  card: {
    gap: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.9,
  },
});

