// @/lib/types.ts
import { NavigationProp } from "@react-navigation/native";

// Re-defining the Record interface here to be easily imported
export interface Record {
  id: number;
  name: string | null;
  count: number | null;
  description: string | null;
  imageUri: string | null;
  lat: number | null;
  lng: number | null;
  date: Date;
}

export interface MapRecord {
  id: number;
  name: string | null;
  count: number | null;
  description: string | null;
  imageUri: string | null;
  lat: number;
  lng: number;
  date: Date;
}

// Define the parameters for each screen in your stack
export type RootStackParamList = {
  table: undefined; // The Table screen takes no parameters
  input: { record: Record } | undefined; // The Input screen can optionally receive a record
  map: undefined;
  settings: undefined;
};

// Type for the navigation prop
export type RootNavigationProp = NavigationProp<RootStackParamList>;
