// @/app/settings.tsx
import { useTheme } from "@/context/themecontext";
import { deleteAllRecords, insertDummyData } from "@/lib/database";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { colors } = useTheme(); // Use the theme context

  // Define styles inside the component to access theme colors
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    // Base style for all buttons
    button: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 15,
    },
    // Style for the primary button's text, which needs to adapt
    primaryButtonText: {
      color: colors.text, // Use the theme's background color for the text
      fontSize: 16,
      fontWeight: "bold",
    },
    // Specific styles for each button type
    primaryButton: {
      backgroundColor: colors.tabIconDefault, // Use tint color for the primary action
    },
    successButton: {
      backgroundColor: colors.success, // Green for success/add actions
    },
    destructiveButton: {
      backgroundColor: colors.destructive, // Red for destructive actions
    },
  });

  const handleClearDB = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to clear the SQLite database? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
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
        { text: "Cancel", style: "cancel" },
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
      {/* Export Data Button */}
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleExportData}
        activeOpacity={0.7}
      >
        {/* Use the new theme-aware text style here */}
        <Text style={styles.primaryButtonText}>Export Data</Text>
      </TouchableOpacity>

      {/* Input Dummy Data Button */}
      <TouchableOpacity
        style={[styles.button, styles.successButton]}
        onPress={handleInputDummyData}
        activeOpacity={0.7}
      >
        <Text style={styles.primaryButtonText}>Input Dummy Data</Text>
      </TouchableOpacity>

      {/* Clear SQLite DB Button */}
      <TouchableOpacity
        style={[styles.button, styles.destructiveButton]}
        onPress={handleClearDB}
        activeOpacity={0.7}
      >
        <Text style={styles.primaryButtonText}>Clear SQLite DB</Text>
      </TouchableOpacity>
    </View>
  );
}
