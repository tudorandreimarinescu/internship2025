import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LoginCredentials, useAuth } from "../../context/AuthContext";
import { sharedStyles as styles } from "../../styles/shared";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, session, loading } = useAuth();

  // If user is already logged in, redirect to calendar
  useEffect(() => {
    if (!loading && session) {
      router.replace("/home");
    }
  }, [session, loading, router]);

  const handleLogin = async () => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    try {
      console.log("Încep procesul de autentificare pentru:", email);
      
      const credentials: LoginCredentials = { email, password };
      const result = await login(credentials);
      
      if (!result.success) {
        const error = result.error!;
        console.error("Login failed with error:", error);
        Alert.alert("Eroare autentificare", error.message);
        return;
      }

      console.log("Autentificare reușită pentru:", result.user?.email);
      console.log("Student profile găsit:", !!result.student);
      
      if (!result.student) {
        console.warn("No student profile found, showing alert");
        Alert.alert(
          "Profil lipsă", 
          "Contul există dar profilul de student nu a fost găsit. Continuați oricum?",
          [
            { 
              text: "Nu", 
              style: "cancel"
            },
            { 
              text: "Da", 
              onPress: () => {
                console.log("User chose to continue without profile, navigating to calendar");
                router.replace("/calendar");
              }
            }
          ]
        );
        return;
      }
      
      console.log("Student profile found, proceeding with navigation");
      
      // Step 3: Add a small delay before navigation to ensure auth state is properly set
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log("Navigating to /home...");
      // Navigate to calendar after successful login
      router.replace("/home");
      
      console.log("Navigation command sent");
    } catch (error: any) {
      console.error("Excepție în procesul de autentificare:", error);
      Alert.alert("Eroare neașteptată", error.message || "A apărut o eroare la autentificare");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Logging in...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Text>Don&apos;t have an account?{" "}</Text>
        <TouchableOpacity 
          onPress={() => !isLoading && router.push("/(auth)/register")}
          disabled={isLoading}
        >
          <Text style={[styles.link, isLoading && { opacity: 0.5 }]}>Register here</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={() => !isLoading && router.push("/(auth)/forget-password")}
        disabled={isLoading}
      >
        <Text style={[styles.link, isLoading && { opacity: 0.5 }]}>Forget password</Text>
      </TouchableOpacity>
    </View>
  );
}
