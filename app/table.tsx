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
import { deleteRecord, selectLatestRecords } from "../lib/database"; // Adjust the import path if necessary
import { Record, RootStackParamList } from "../navigation/types"; // Adjust path if needed

// // Define an interface for the record object for better type safety
// interface Record {
//   id: number;
//   name: string | null;
//   count: number | null;
//   description: string | null;
//   imageUri: string | null;
//   lat: number | null;
//   lng: number | null;
//   date: Date;
// }

export default function TableScreen() {
  // Use the defined type for the navigation prop
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [records, setRecords] = useState<Record[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [imageError, setImageError] = useState(false);

  const loadRecords = useCallback(() => {
    try {
      const dbRecords = selectLatestRecords(100, 0);
      setRecords(dbRecords);
    } catch (error) {
      console.error("Failed to fetch records:", error);
      Alert.alert("Error", "Failed to load records.");
    }
  }, []);

  // useFocusEffect runs when the screen is focused.
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
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
              // Optimistically remove the record from the UI
              setRecords((prevRecords) =>
                prevRecords.filter((record) => record.id !== id)
              );
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
      // This is now type-safe and the error is gone
      navigation.navigate("input", { record: selectedRecord });
      setModalVisible(false);
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
    <>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {selectedRecord && (
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
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

              {/* Image display section */}
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
    </>
  );
}

const styles = StyleSheet.create({
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "stretch", // Changed to stretch for better layout
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
