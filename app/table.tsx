// @/app/table.tsx
import { useTheme } from "@/context/themecontext";
import {
  countRecords,
  deleteRecord,
  selectLatestRecords,
} from "@/lib/database";
import Pagination from "@/lib/pagination";
import { Record, RootStackParamList } from "@/navigation/types";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TableScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    list: {
      flex: 1, // This makes the FlatList take up all available space
    },
    // For making the pagination not have any weird layout issues
    paginationContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    listContentContainer: {
      paddingBottom: 80, // Add padding to the bottom of the list's content, to avoid overlap with the pagination component
    },
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
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
    button: {
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    buttonText: {
      color: colors.text,
      textAlign: "center",
    },
    paginationBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderTopWidth: 1,
    },
    paginationText: {
      fontSize: 14,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      margin: 20,
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
      width: "90%",
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
      color: colors.tabIconDefault,
      textAlign: "center",
      marginVertical: 20,
    },
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [records, setRecords] = useState<Record[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [imageError, setImageError] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = () => {
        try {
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
        isActive = false;
      };
    }, [offset])
  );

  const handleView = (item: Record) => {
    setSelectedRecord(item);
    setImageError(false);
    setModalVisible(true);
  };

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

  const handlePrevious = () => {
    setOffset((prevOffset) => Math.max(0, prevOffset - limit));
  };

  const handleNext = () => {
    if (offset + limit < totalRecords) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  const renderItem = ({ item }: { item: Record }) => (
    <View style={[styles.itemContainer, { borderBottomColor: colors.tint }]}>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={{ color: colors.text }}>Count: {item.count}</Text>
        <Text style={{ color: colors.text }}>
          Date: {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.background }]}
          onPress={() => handleView(item)}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.destructive }]}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContentContainer}
      />

      {/* Wrap the Pagination component and apply the absolute positioning style */}
      <View style={styles.paginationContainer}>
        <Pagination
          offset={offset}
          limit={limit}
          totalRecords={totalRecords}
          onPrevious={handlePrevious}
          onNext={handleNext}
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
          {/* Modal content*/}
          <View style={styles.centeredView}>
            <View
              style={[styles.modalView, { backgroundColor: colors.background }]}
            >
              <Text style={[styles.modalText, { color: colors.text }]}>
                <Text style={styles.bold}>Name:</Text>{" "}
                {selectedRecord.name || "N/A"}
              </Text>
              <Text style={[styles.modalText, { color: colors.text }]}>
                <Text style={styles.bold}>Count:</Text>{" "}
                {selectedRecord.count || "N/A"}
              </Text>
              <Text style={[styles.modalText, { color: colors.text }]}>
                <Text style={styles.bold}>Description:</Text>{" "}
                {selectedRecord.description || "N/A"}
              </Text>
              <Text style={[styles.modalText, { color: colors.text }]}>
                <Text style={styles.bold}>Latitude:</Text>{" "}
                {selectedRecord.lat ?? "N/A"}
              </Text>
              <Text style={[styles.modalText, { color: colors.text }]}>
                <Text style={styles.bold}>Longitude:</Text>{" "}
                {selectedRecord.lng ?? "N/A"}
              </Text>
              <Text style={[styles.modalText, { color: colors.text }]}>
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
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colors.background },
                  ]}
                  onPress={handleEdit}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colors.background },
                  ]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
