import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Quote, Heart, Brain, Notebook, Zap, Rocket } from "lucide-react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { QuotesScreen } from "../screens/QuotesScreen";
import { AffirmationsScreen } from "../screens/AffirmationsScreen";
import { EmotionalCoachScreen } from "../screens/EmotionalCoachScreen";
import { JournalScreen } from "../screens/JournalScreen";
import { MotivateScreen } from "../screens/MotivateScreen";
import { KickScreen } from "../screens/KickScreen";
import { palette } from "../theme/colors";

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
  },
};

const iconProps = { size: 20 };

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: palette.muted,
          tabBarStyle: {
            borderTopWidth: 0.5,
            borderTopColor: "#E5E7EB",
            paddingBottom: 6,
            paddingTop: 6,
            height: 64,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => <Home {...iconProps} color={color} />,
          }}
        />
        <Tab.Screen
          name="Quotes"
          component={QuotesScreen}
          options={{
            tabBarIcon: ({ color }) => <Quote {...iconProps} color={color} />,
          }}
        />
        <Tab.Screen
          name="Affirmations"
          component={AffirmationsScreen}
          options={{
            title: "I-Affirmations",
            tabBarIcon: ({ color }) => <Heart {...iconProps} color={color} />,
          }}
        />
        <Tab.Screen
          name="Coach"
          component={EmotionalCoachScreen}
          options={{
            title: "Emotional Coach",
            tabBarIcon: ({ color }) => <Brain {...iconProps} color={color} />,
          }}
        />
        <Tab.Screen
          name="Journal"
          component={JournalScreen}
          options={{
            title: "AI Journal",
            tabBarIcon: ({ color }) => <Notebook {...iconProps} color={color} />,
          }}
        />
        <Tab.Screen
          name="Motivate"
          component={MotivateScreen}
          options={{
            title: "Motivate Me",
            tabBarIcon: ({ color }) => <Zap {...iconProps} color={color} />,
          }}
        />
        <Tab.Screen
          name="Kick"
          component={KickScreen}
          options={{
            title: "Kick in the Pants",
            tabBarIcon: ({ color }) => <Rocket {...iconProps} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

