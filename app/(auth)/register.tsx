import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { RegisterData, useAuth } from "../../context/AuthContext";
import { sharedStyles as styles } from "../../styles/shared";

export default function RegisterScreen() {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [group, setGroup] = useState("");
  const [year, setYear] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginOption, setShowLoginOption] = useState(false);
  
  // Hooks
  const router = useRouter();
  const { register } = useAuth();
  
  // Clear error when typing in email field if it was a duplicate
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errorMessage && showLoginOption) {
      setErrorMessage("");
      setShowLoginOption(false);
    }
  };

  // Registration handler
  const handleRegister = async () => {
    // Prevent multiple submissions
    if (isLoading) return;
    
    // Reset UI state
    setErrorMessage("");
    setShowLoginOption(false);
    setIsLoading(true);
    
    // Prepare data
    const registerData: RegisterData = {
      firstName,
      lastName,
      group,
      year,
      specialization,
      email,
      password
    };

    try {
      console.log("Începe procesul de înregistrare pentru:", email);
      
      const result = await register(registerData);
      
      if (!result.success) {
        const error = result.error;
        
        if (error?.type === 'duplicate_email' && error.shouldNavigateToLogin) {
          setErrorMessage(error.message);
          setShowLoginOption(true);
        } else {
          setErrorMessage(error?.message || "Eroare la înregistrare");
          setShowLoginOption(false);
        }
        setIsLoading(false);
        return;
      }

      if (result.error?.type === 'student_creation') {
        setErrorMessage(result.error.message);
      } else {
        setErrorMessage("");
        Alert.alert(
          "Succes", 
          "Înregistrare completă! Puteți să vă autentificați acum."
        );
      }
      
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 100);
      
    } catch (error: any) {
      console.error("Unexpected error in registration:", error);
      setErrorMessage("A apărut o eroare la înregistrare. Încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation to login
  const navigateToLogin = () => {
    if (!isLoading) {
      router.replace("/(auth)/login");
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Înregistrare Student</Text>
        
        {/* Form Fields */}
        <TextInput
          placeholder="Prenume"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          autoCapitalize="words"
        />
        
        <TextInput
          placeholder="Nume"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          autoCapitalize="words"
        />
        
        <TextInput
          placeholder="Grupă (ex. 1731A)"
          value={group}
          onChangeText={setGroup}
          style={styles.input}
        />
        
        <TextInput
          placeholder="An studiu (1-6)"
          value={year}
          onChangeText={setYear}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
        />
        
        <TextInput
          placeholder="Specializare (ex. Informatică)"
          value={specialization}
          onChangeText={setSpecialization}
          style={styles.input}
        />
        
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          style={[
            styles.input, 
            errorMessage && showLoginOption ? styles.inputError : null
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        {/* Error message for duplicate email */}
        {errorMessage && showLoginOption ? (
          <Text style={styles.inputHelperText}>
            Încearcați un alt email sau autentificați-vă
          </Text>
        ) : null}
        <TextInput
          placeholder="Parolă"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        
        {/* Register Button */}
        <TouchableOpacity 
          style={[
            styles.button, 
            isLoading ? styles.buttonDisabled : null
          ]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator 
                size="small" 
                color="#fff" 
                style={{ marginRight: 8 }} 
              />
              <Text style={styles.buttonText}>Creez contul...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Creare cont</Text>
          )}
        </TouchableOpacity>
        
        {/* Error Container */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            {showLoginOption ? (
              <TouchableOpacity 
                onPress={navigateToLogin}
                style={styles.errorButton}
              >
                <Text style={styles.errorButtonText}>
                  Du-te la Login
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
        
        {/* Login Link */}
        <TouchableOpacity 
          onPress={navigateToLogin}
          disabled={isLoading}
        >
          <Text style={[
            styles.link, 
            isLoading ? { opacity: 0.5 } : null
          ]}>
            <Text>Ai deja un cont?</Text>
            <Text>{" "}</Text>
            <Text>Autentifică-te aici</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
