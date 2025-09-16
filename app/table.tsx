import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
// Adjust the import path if necessary. Assumes countRecords function exists.
import {
  countRecords,
  deleteRecord,
  selectLatestRecords,
} from "../lib/database";
import { Record, RootStackParamList } from "../navigation/types"; // Adjust path if needed

export default function TableScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [records, setRecords] = useState<Record[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [imageError, setImageError] = useState(false);

  // State for pagination
  const [offset, setOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10; // Set the number of records per page

  // useFocusEffect runs when the screen is focused or when offset changes.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = () => {
        try {
          // Fetch total record count and the records for the current page
          const total = countRecords();
          const dbRecords = selectLatestRecords(limit, offset);

          if (isActive) {
            setTotalRecords(total);
            setRecords(dbRecords);
          }
        } catch (error) {
          console.error("Failed to fetch records:", error);
          Alert.alert("Error", "Failed to load records.");
        }
      };

      loadData();

      return () => {
        isActive = false; // Cleanup to prevent state updates on unmounted component
      };
    }, [offset]) // Rerun effect if offset changes
  );

  // Handles the press of the "View" button
  const handleView = (item: Record) => {
    setSelectedRecord(item);
    setImageError(false); // Reset image error state when opening modal
    setModalVisible(true);
  };

  // Handles the press of the "Delete" button with a confirmation
  const handleDelete = (id: number, name: string | null) => {
    Alert.alert(
      "Delete Record",
      `Are you sure you want to delete the record for "${name || "Unnamed"}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            try {
              deleteRecord(id);
              // After deleting, reload data to reflect changes and pagination
              const total = countRecords();
              const newOffset =
                offset >= total && offset > 0 ? offset - limit : offset;
              const dbRecords = selectLatestRecords(limit, newOffset);

              setTotalRecords(total);
              setOffset(newOffset);
              setRecords(dbRecords);
            } catch (error) {
              console.error("Failed to delete record:", error);
              Alert.alert("Error", "Failed to delete the record.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = () => {
    if (selectedRecord) {
      navigation.navigate("input", { record: selectedRecord });
      setModalVisible(false);
    }
  };

  // Pagination navigation handlers
  const handlePrevious = () => {
    setOffset((prevOffset) => Math.max(0, prevOffset - limit));
  };

  const handleNext = () => {
    if (offset + limit < totalRecords) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  const renderItem = ({ item }: { item: Record }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>Count: {item.count}</Text>
        <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="View" onPress={() => handleView(item)} />
        <Button
          title="Delete"
          onPress={() => handleDelete(item.id, item.name)}
          color="red"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Pagination Bar */}
      <View style={styles.paginationBar}>
        <Button
          title="Previous"
          onPress={handlePrevious}
          disabled={offset === 0}
        />
        <Text style={styles.paginationText}>
          {`Showing ${totalRecords > 0 ? offset + 1 : 0}-${
            offset + records.length
          } of ${totalRecords}`}
        </Text>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={offset + limit >= totalRecords}
        />
      </View>

      {selectedRecord && (
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          {/* Modal content remains the same... */}
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Name:</Text>{" "}
                {selectedRecord.name || "N/A"}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Count:</Text>{" "}
                {selectedRecord.count || "N/A"}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Description:</Text>{" "}
                {selectedRecord.description || "N/A"}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Latitude:</Text>{" "}
                {selectedRecord.lat ?? "N/A"}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Longitude:</Text>{" "}
                {selectedRecord.lng ?? "N/A"}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Date:</Text>{" "}
                {new Date(selectedRecord.date).toLocaleString()}
              </Text>

              <View style={styles.imageContainer}>
                {selectedRecord.imageUri && !imageError ? (
                  <Image
                    source={{ uri: selectedRecord.imageUri }}
                    style={styles.modalImage}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Text style={styles.noImageText}>No image attached</Text>
                )}
              </View>

              <View style={styles.modalButtonContainer}>
                <Button title="Edit" onPress={handleEdit} />
                <Button
                  title="Close"
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  paginationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#f8f8f8",
  },
  paginationText: {
    fontSize: 14,
    color: "#333",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)", // Added for better modal focus
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%", // Set a max-width for the modal
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
  },
  bold: {
    fontWeight: "bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  modalImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 15,
  },
  noImageText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
});
