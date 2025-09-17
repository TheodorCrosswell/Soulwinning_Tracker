// @/app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/input" />; // Redirects to input screen
}
