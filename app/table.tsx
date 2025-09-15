import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const dummyData = [
  { id: '1', name: 'John Doe', description: 'Met at the park' },
  { id: '2', name: 'Jane Smith', description: 'Talked at the coffee shop' },
  { id: '3', name: 'Peter Jones', description: 'Handed a tract' },
];

export default function TableScreen() {
  const renderItem = ({ item }: { item: { id: string; name: string; description: string } }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>{item.description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Inspect" onPress={() => alert(`Inspecting ${item.name}`)} />
        <Button title="Share" onPress={() => alert(`Sharing ${item.name}`)} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={dummyData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});