import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View, Text } from "react-native";
import { useEffect } from "react";

export default function Index() {
  const { session, loading } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('Index component - loading:', loading, 'session:', !!session);
  }, [loading, session]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  console.log('Index component - redirecting based on session:', !!session);

  // If user is authenticated, go to cursuri home; otherwise go to auth index
  if (session) {
    console.log('Redirecting to cursuri home');
    return <Redirect href="/(cursuri)/home" />;
  }

  console.log('Redirecting to auth index');
  return <Redirect href="/(auth)" />;
}
