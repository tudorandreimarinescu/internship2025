import { useCourses } from '@/context/CoursesContext';
import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

export default function CoursesScreen() {
  const { courses, loading } = useCourses();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleGoBack = () => {
    router.back(); // Use expo-router's back method
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f9f9f9' }]}>
      {/* Header cu buton pentru navigare */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={[styles.headerButton, styles.backButton]}
        >
          <Text style={styles.headerButtonText}>Inapoi</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>Lista de cursuri</Text>

      {loading ? (
        <Text style={styles.loadingText}>Se încarcă...</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {Object.entries(item).map(([key, value]) => (
                <Text key={key} style={styles.field}>
                  <Text style={styles.fieldKey}>{key}:</Text> {String(value)}
                </Text>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  headerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  backButton: {
    backgroundColor: '#2196f3',
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  field: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  fieldKey: {
    fontWeight: 'bold',
    color: '#333',
  },
});
