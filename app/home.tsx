import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bine ai venit!</Text>
      
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
});
