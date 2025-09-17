// map.tsx
import { useTheme } from "@/context/themecontext";
import { countRecords, selectLatestRecordsForMap } from "@/lib/database";
import Pagination from "@/lib/pagination";
import { Record } from "@/navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const { colors } = useTheme();
  const [records, setRecords] = useState<Record[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 50;

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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

      {/*Pagination component */}
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
