import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { logout, student } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login'); // Redirect to auth index screen
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F5F5F5' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
        Bine ai venit{student ? `, ${student.Prenume}!` : '!'}
      </Text>
      
      <View style={styles.buttonContainer}>
        <Link href="/(calendar)/calendar" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Mergi la calendar</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.buttonContainer}>
        <Link href="/(cursuri)/cursuri" asChild>
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
  logoutButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
