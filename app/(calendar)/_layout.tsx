// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../../context/AuthContext";
import { CalendarProvider } from '../../context/CalendarContext';

export default function RootLayout() {
  return (
    
      <CalendarProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CalendarProvider>
    
  );
}