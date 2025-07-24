import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase'; // Asigură-te că ai configurat supabase

export default function HomeScreen() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Eroare', 'A apărut o problemă la deconectare.');
    } else {
      Alert.alert('Succes', 'Te-ai deconectat cu succes.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bine ai venit</Text> 
      
      <View style={styles.buttonContainer}>
        <Link href="../calendar" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Mergi la calendar</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.buttonContainer}>
        <Link href="../cursuri" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Mergi la cursuri</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 10, // Spațiere între butoane
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: 200, // Dimensiune fixă pentru butoane
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#D32F2F', // Culoare roșie pentru butonul de logout
  },
});
