import { useCourses } from '@/context/CoursesContext';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function CoursesScreen() {
  const { courses, loading } = useCourses();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de cursuri</Text>

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
