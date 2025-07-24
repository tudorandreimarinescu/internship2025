import { Redirect } from "expo-router";

export default function CursuriIndex() {
  // Redirect to the home page within the cursuri group
  return <Redirect href="/(cursuri)/home" />;
}
