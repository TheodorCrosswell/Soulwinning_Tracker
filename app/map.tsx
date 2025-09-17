// map.tsx
import { useTheme } from "@/context/themecontext"; // Import the useTheme hook
import { countRecords, selectLatestRecordsForMap } from "@/lib/database";
import Pagination from "@/lib/pagination"; // Import the reusable component
import { Record } from "@/navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const { colors } = useTheme(); // Use the theme hook to get the current colors
  const [records, setRecords] = useState<Record[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 50; // Or a different limit if you prefer

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = () => {
        try {
          const total = countRecords();
          const dbRecords = selectLatestRecordsForMap(limit, offset);

          if (isActive) {
            setTotalRecords(total);
            setRecords(dbRecords);
          }
        } catch (error) {
          console.error("Failed to fetch records for map:", error);
          Alert.alert("Error", "Failed to load records for the map.");
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [offset])
  );

  const handlePrevious = () => {
    setOffset((prevOffset) => Math.max(0, prevOffset - limit));
  };

  const handleNext = () => {
    if (offset + limit < totalRecords) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  // Define styles dynamically based on the theme colors
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Apply background color from theme
    },
    map: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {records.map(
          (record) =>
            record.lat != null &&
            record.lng != null && (
              <Marker
                key={record.id}
                coordinate={{ latitude: record.lat, longitude: record.lng }}
                title={
                  (record.name || "Unnamed Record") +
                  ` - ${record.count} - ${record.description}`
                }
                description={`Date: ${new Date(record.date).toLocaleString()}`}
              />
            )
        )}
      </MapView>

      {/* Use the Pagination component */}
      <Pagination
        offset={offset}
        limit={limit}
        totalRecords={totalRecords}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </View>
  );
}
