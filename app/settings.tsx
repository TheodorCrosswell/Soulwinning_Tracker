import { deleteAllRecords } from "@/lib/database";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SettingsScreen() {
  const [maxTableRows, setMaxTableRows] = useState("100");
  const [maxMapMarkers, setMaxMapMarkers] = useState("50");

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

  const handleExportData = () => {
    Alert.alert("Export Data", "This feature is not yet implemented.");
  };

  const handleSaveChanges = () => {
    Alert.alert(
      "Settings Saved",
      `(This feature is not actually implemented yet)
      Max Table Rows: ${maxTableRows}\nMax Map Markers: ${maxMapMarkers}`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingOption}>
        <Text style={styles.label}>Max rows displayed on table screen</Text>
        <TextInput
          style={styles.input}
          onChangeText={setMaxTableRows}
          value={maxTableRows}
          keyboardType="numeric"
          placeholder="e.g., 100"
        />
      </View>
      <View style={styles.settingOption}>
        <Text style={styles.label}>Max markers displayed on map screen</Text>
        <TextInput
          style={styles.input}
          onChangeText={setMaxMapMarkers}
          value={maxMapMarkers}
          keyboardType="numeric"
          placeholder="e.g., 50"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={handleSaveChanges} />
      </View>
      <View style={styles.destructiveButtonContainer}>
        <Button
          title="Export Data"
          onPress={handleExportData}
          color="#007AFF"
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
