// @/app/_layout.tsx
import { ThemeProvider, useTheme } from "@/context/themecontext"; // Assuming you've set up path aliases for @/
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

// The main layout component that provides the theme to the entire app
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

// The AppLayout component now consumes the theme context
function AppLayout() {
  const { colors } = useTheme(); // Use the hook to get the current theme's colors

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This screen is not visible in the tab bar
        }}
      />

      <Tabs.Screen
        name="input"
        options={{
          title: "Input",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="table"
        options={{
          title: "Table",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="table" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="map" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="gear" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
