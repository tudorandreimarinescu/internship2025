import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function CursuriHomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { logout, student } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)'); // Redirect to auth index screen
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 15,
    width: '80%',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
