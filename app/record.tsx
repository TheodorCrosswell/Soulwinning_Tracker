import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function RecordScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: undefined,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const recordLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const saveEntry = () => {
    // Logic to save the entry will be implemented later
    alert("Entry saved!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} onChangeText={setName} value={name} />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        multiline
      />
      <View style={styles.buttonContainer}>
        <Button title="Attach Image" onPress={pickImage} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Record Location" onPress={recordLocation} />
      </View>
      {location && (
        <Text>
          Location: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Save Entry" onPress={saveEntry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    marginBottom: 15,
  },
});
