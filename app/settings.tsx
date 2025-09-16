import { deleteAllRecords, insertDummyData } from "@/lib/database";
import { Alert, Button, StyleSheet, View } from "react-native";

export default function SettingsScreen() {
  const handleClearDB = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to clear the SQLite database? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            console.log("SQLite DB cleared");
            deleteAllRecords();
          },
        },
      ]
    );
  };

  const handleInputDummyData = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to insert dummy data into the SQLite database?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            console.log("Dummy data inserted");
            insertDummyData();
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "This feature is not yet implemented.");
  };
  return (
    <View style={styles.container}>
      {/* The "Save Changes" button is no longer necessary */}
      <View style={styles.destructiveButtonContainer}>
        <Button
          title="Export Data"
          onPress={handleExportData}
          color="#007AFF"
        />
      </View>
      <View style={styles.destructiveButtonContainer}>
        <Button
          title="Input Dummy Data"
          onPress={handleInputDummyData}
          color="#34C759"
        />
      </View>
      <View style={styles.destructiveButtonContainer}>
        <Button
          title="Clear SQLite DB"
          onPress={handleClearDB}
          color="#FF3B30"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  settingOption: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  destructiveButtonContainer: {
    marginTop: 15,
  },
});
