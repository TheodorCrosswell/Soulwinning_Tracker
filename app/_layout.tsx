import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="record"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="book" size={24} color={color} />,
          title: 'Record',
        }}
      />
      <Tabs.Screen
        name="table"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="table" size={24} color={color} />,
          title: 'Table',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="map" size={24} color={color} />,
          title: 'Map',
        }}
      />
    </Tabs>
  );
}
