import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="input"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="book" size={24} color={color} />
          ),
          title: "Input",
        }}
      />
      <Tabs.Screen
        name="table"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="table" size={24} color={color} />
          ),
          title: "Table",
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="map" size={24} color={color} />
          ),
          title: "Map",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="gear" size={24} color={color} />
          ),
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
