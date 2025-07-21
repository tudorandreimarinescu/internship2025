import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { sharedStyles as styles } from "../../styles/shared";

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = () => {
    console.log("Reset password for:", email);
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forget Password</Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
        <Text style={styles.link}>Already have an account?{" "}Login here</Text>
      </TouchableOpacity>
    </View>
  );
}
