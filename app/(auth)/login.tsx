import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { sharedStyles as styles } from "../../styles/shared";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { handleLogin } = useAuth();

  const onLogin = async () => {
    const success = await handleLogin(email, password);
    if (success) {
      router.replace("/home");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.image}
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

      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Register here</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/forget-password")}>
        <Text style={styles.link}>Forget password</Text>
      </TouchableOpacity>
    </View>
  );
}
