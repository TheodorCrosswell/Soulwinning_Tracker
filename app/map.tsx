import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const dummyData = [
  { id: '1', name: 'John Doe', latitude: 34.052235, longitude: -118.243683 },
  { id: '2', name: 'Jane Smith', latitude: 34.053235, longitude: -118.244683 },
  { id: '3', name: 'Peter Jones', latitude: 34.054235, longitude: -118.245683 },
];

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Button title="Filter by Date" onPress={() => alert('Date filter not implemented yet')} />
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 34.052235,
          longitude: -118.243683,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {dummyData.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.name}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
});