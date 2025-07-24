// app/_layout.tsx
import { Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { CalendarProvider } from "../../context/CalendarContext";

function CalendarProviderWithStudent({ children }: { children: React.ReactNode }) {
  const { student } = useAuth(); // Get student from AuthContext
  const studentYear = student?.An; 
  return (
    <CalendarProvider studentYear={studentYear}>
      {children}
    </CalendarProvider>
  );
}

export default function RootLayout() {
  return (
    <CalendarProviderWithStudent>
      <Stack screenOptions={{ headerShown: false }} />
    </CalendarProviderWithStudent>
  );
}
