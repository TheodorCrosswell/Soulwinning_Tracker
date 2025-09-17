// @/app/input.tsx
import { useTheme } from "@/context/themecontext"; // Import the useTheme hook
import { init, insertRecord, updateRecord } from "@/lib/database"; // Make sure the path is correct
import { RootNavigationProp, RootStackParamList } from "@/navigation/types"; // Adjust path if needed
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function InputScreen() {
  const { colors } = useTheme(); // Use the theme context

  // Use RouteProp to type the route and its params
  const route = useRoute<RouteProp<RootStackParamList, "input">>();
  const navigation = useNavigation<RootNavigationProp>();
  // The 'record' property is now correctly typed
  const record = route.params?.record;

  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [count, setCount] = useState(0); // Default value is 0
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  useEffect(() => {
    init()
      .then(() => {
        console.log("Database and table initialized");
      })
      .catch((err: unknown) => {
        console.log("Database initialization failed");
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (record) {
      setId(record.id);
      setName(record.name || "");
      setCount(record.count || 0);
      setDescription(record.description || "");
      setImage(record.imageUri || null);
      if (record.lat && record.lng) {
        setLocation({
          coords: {
            latitude: record.lat,
            longitude: record.lng,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: new Date(record.date).getTime(),
        });
      }
      setDate(new Date(record.date));
      setBannerMessage("Editing existing record");
    }
  }, [record]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
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

  // Functions to handle count increase and decrease
  const increaseCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decreaseCount = () => {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0)); // Prevents going below 0
  };

  const saveRecord = async () => {
    try {
      if (id) {
        await updateRecord(
          id,
          name,
          count,
          description,
          image,
          location?.coords.latitude ?? null,
          location?.coords.longitude ?? null,
          date.toISOString()
        );
        Alert.alert("Success", "Record updated successfully!");
      } else {
        await insertRecord(
          name,
          count,
          description,
          image,
          location?.coords.latitude ?? null,
          location?.coords.longitude ?? null,
          date.toISOString()
        );
        Alert.alert("Success", "Record saved successfully!");
      }
      clearForm();
      setBannerMessage(null);
    } catch (err) {
      console.log("Error saving record:", err);
      Alert.alert("Error", "Failed to save the record.");
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
    setMode("date");
  };

  const showTimePicker = () => {
    setShowPicker(true);
    setMode("time");
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);

    if (Platform.OS === "android") {
      setShowPicker(false);
    }
  };

  const clearForm = () => {
    setId(null);
    setName("");
    setCount(0);
    setDescription("");
    setImage(null);
    setLocation(null);
    setDate(new Date());
    setBannerMessage(null);
  };

  const clearName = () => setName("");
  const clearCount = () => setCount(0);
  const clearDescription = () => setDescription("");
  const clearImage = () => setImage(null);
  const clearLocation = () => setLocation(null);

  const resetDate = () => {
    const now = new Date();
    const newDate = new Date(date);
    newDate.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
    setDate(newDate);
  };

  const resetTime = () => {
    const now = new Date();
    const newDate = new Date(date);
    newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    setDate(newDate);
  };

  // Dynamic styles that depend on the theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    label: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginBottom: 12,
      borderRadius: 5,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    fieldContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    countContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    countInput: {
      flex: 2,
      textAlign: "center",
      marginHorizontal: 10,
      marginBottom: 0,
    },
    countButton: {
      flex: 1,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    infoText: {
      fontSize: 16,
      marginBottom: 12,
      textAlign: "center",
      color: colors.tabIconDefault,
    },
    dateText: {
      fontSize: 16,
      color: colors.text,
    },
    buttonGroup: {
      flexDirection: "row",
    },
    buttonWrapper: {
      marginLeft: 10,
    },
    buttonWrapperFlex1: {
      flex: 1,
    },
    buttonWrapperFlex3: {
      flex: 3,
      marginRight: 10,
    },
    // TouchableOpacity Styles
    button: {
      backgroundColor: colors.background,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    buttonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    resetButton: {
      // backgroundColor: "#6c757d",
      backgroundColor: colors.tabIconDefault,
    },
    dangerButton: {
      backgroundColor: colors.destructive,
    },
    banner: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      backgroundColor: colors.warning,
      alignItems: "center",
    },
    bannerText: {
      color: colors.background,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      {/* Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name(s)</Text>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={clearName}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} onChangeText={setName} value={name} />

      {/* Count */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Count</Text>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={clearCount}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.countContainer}>
        <View style={styles.countButton}>
          <TouchableOpacity style={styles.button} onPress={decreaseCount}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, styles.countInput]}
          onChangeText={(text) => setCount(Number(text) || 0)}
          value={String(count)}
          keyboardType="numeric"
        />
        <View style={styles.countButton}>
          <TouchableOpacity style={styles.button} onPress={increaseCount}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={clearDescription}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        multiline
      />

      {/* Image */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapperFlex3}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Attach Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapperFlex1}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={clearImage}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.infoText}>
        {image ? "Image attached" : "No image attached"}
      </Text>

      {/* Location */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapperFlex3}>
          <TouchableOpacity style={styles.button} onPress={recordLocation}>
            <Text style={styles.buttonText}>Record Location</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapperFlex1}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={clearLocation}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.infoText}>
        {location
          ? `${location.coords.latitude.toFixed(
              7
            )}, ${location.coords.longitude.toFixed(7)}`
          : "No location recorded"}
      </Text>

      {/* Date */}
      <View style={styles.buttonRow}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        <View style={styles.buttonGroup}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={showDatePicker}>
              <Text style={styles.buttonText}>Select Date</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetDate}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Time */}
      <View style={styles.buttonRow}>
        <Text style={styles.dateText}>{date.toLocaleTimeString()}</Text>
        <View style={styles.buttonGroup}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={showTimePicker}>
              <Text style={styles.buttonText}>Select Time</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetTime}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showPicker && (
        <DateTimePicker
          mode={mode}
          display="default"
          value={date}
          onChange={onChange}
        />
      )}
      {/* Save & Clear */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapperFlex3}>
          <TouchableOpacity style={styles.button} onPress={saveRecord}>
            <Text style={styles.buttonText}>Save Record</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapperFlex1}>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={clearForm}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      {bannerMessage && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{bannerMessage}</Text>
        </View>
      )}
    </View>
  );
}
