import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { LoginCredentials, useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, session, loading } = useAuth();
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    if (!loading && session) {
      router.replace('/home');
    }
  }, [session, loading, router]);

  const handleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const credentials: LoginCredentials = { email, password };
      const result = await login(credentials);

      if (!result.success) {
        Alert.alert('Eroare autentificare', result.error?.message || 'Eroare necunoscută');
        return;
      }

      if (!result.student) {
        Alert.alert(
          'Profil lipsă',
          'Contul există dar profilul de student nu a fost găsit. Continuați oricum?',
          [
            { text: 'Nu', style: 'cancel' },
            { text: 'Da', onPress: () => router.replace('/home') },
          ]
        );
        return;
      }

      await new Promise((res) => setTimeout(res, 300));
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Eroare', error.message || 'A apărut o eroare');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? '#000' : '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
      }}
    >
      {/* Imagine cu overlay negru în dark mode */}
      <View style={{ position: 'relative', marginBottom: 20 }}>
        <Image
          source={require('../../assets/images/login.png')}
          style={{
            width: 200,
            height: 200,
            borderRadius: 10,
            resizeMode: 'contain',
          }}
        />
        {isDark && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000',
              opacity: 0.4,
              borderRadius: 10,
            }}
          />
        )}
      </View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: isDark ? '#fff' : '#000',
          marginBottom: 20,
        }}
      >
        Login
      </Text>

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor={isDark ? '#888' : '#aaa'}
        value={email}
        onChangeText={setEmail}
        style={{
          width: '100%',
          backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
          color: isDark ? '#fff' : '#000',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Enter your password"
        placeholderTextColor={isDark ? '#888' : '#aaa'}
        value={password}
        onChangeText={setPassword}
        style={{
          width: '100%',
          backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
          color: isDark ? '#fff' : '#000',
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={{
          width: '100%',
          backgroundColor: isLoading ? '#888' : '#2196f3',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        {isLoading && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          {isLoading ? 'Logging in...' : 'Continue'}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Text style={{ color: isDark ? '#aaa' : '#333' }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isLoading}>
          <Text style={{ color: '#2196f3', fontWeight: 'bold', opacity: isLoading ? 0.5 : 1 }}>
            Register here
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(auth)/forget-password')} disabled={isLoading}>
        <Text style={{ color: '#2196f3', fontWeight: 'bold', opacity: isLoading ? 0.5 : 1 }}>
          Forget password
        </Text>
      </TouchableOpacity>
    </View>
  );
}
